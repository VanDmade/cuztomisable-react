// src/components/table/DataTable.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { api } from '../../api';
import { Dropdown, type DropdownOption } from '../../components/form/Dropdown';
import { FormInput } from '../../components/form/Input';
import Button from '../../components/ui/Button';
import { useTheme } from '../../providers/ThemeProvider';

export type DataTableColumn<T> = {
    key: string;
    title: string;
    width?: number;
    flex?: number;
    align?: 'left' | 'center' | 'right';
    render?: (row: T) => React.ReactNode;
    accessor?: (row: T) => string | number | null | undefined;
    headerStyle?: StyleProp<ViewStyle>;
    headerTextStyle?: StyleProp<TextStyle>;
    cellStyle?: StyleProp<ViewStyle>;
    cellTextStyle?: StyleProp<TextStyle>;
};

export type DataTableFilter = {
    key: string;
    label: string;
    options: DropdownOption<string | number>[];
    placeholder?: string;
    defaultValue?: string | number;
};

type PaginationMeta = {
    total?: number;
    page?: number;
    perPage?: number;
};

type DataTableProps<T> = {
    url?: string;
    name: string;
    columns: DataTableColumn<T>[];
    data?: T[];
    rowKey?: (row: T, index: number) => string | number;
    searchable?: boolean;
    filters?: DataTableFilter[];
    initialPageSize?: number;
    pageSizeOptions?: number[];
    extraParams?: Record<string, any>;
    onRowPress?: (row: T) => void;
    transformResponse?: (payload: any) => { rows: T[]; meta?: PaginationMeta };
};

const DEFAULT_PAGE_SIZES = [10, 25, 50];

function extractRows<T>(payload: any): { rows: T[]; meta?: PaginationMeta } {
    if (!payload) {
        return { rows: [] };
    }
    if (Array.isArray(payload)) {
        return { rows: payload };
    }
    if (Array.isArray(payload?.data)) {
        return { rows: payload.data, meta: payload.meta ?? payload.pagination };
    }
    if (Array.isArray(payload?.items)) {
        return { rows: payload.items, meta: payload.meta ?? payload.pagination };
    }
    return { rows: [], meta: payload?.meta ?? payload?.pagination };
}

export function DataTable<T>({
    url,
    name,
    columns,
    data,
    rowKey,
    searchable = true,
    filters = [],
    initialPageSize = 10,
    pageSizeOptions = DEFAULT_PAGE_SIZES,
    extraParams,
    onRowPress,
    transformResponse,
}: DataTableProps<T>) {
    const theme = useTheme();
    const isClient = data !== undefined;
    const [rows, setRows] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterValues, setFilterValues] = useState<Record<string, string | number | undefined>>(() => {
        return filters.reduce((acc, f) => {
            acc[f.key] = f.defaultValue;
            return acc;
        }, {} as Record<string, string | number | undefined>);
    });
    const [meta, setMeta] = useState<PaginationMeta | null>(null);

    useEffect(() => {
        const id = setTimeout(() => setSearchTerm(searchInput.trim()), 350);
        return () => clearTimeout(id);
    }, [searchInput]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm, pageSize, filterValues]);

    const params = useMemo(() => {
        const baseParams: Record<string, any> = {
            page,
            per_page: pageSize,
        };
        if (searchTerm) {
            baseParams.search = searchTerm;
        }
        Object.entries(filterValues).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                baseParams[key] = value;
            }
        });
        return { ...baseParams, ...(extraParams ?? {}) };
    }, [page, pageSize, searchTerm, filterValues, extraParams]);

    useEffect(() => {
        if (isClient) {
            return;
        }
        if (!url) {
            return;
        }
        let active = true;
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await api.get(url, { params });
                const payload = transformResponse
                    ? transformResponse(response.data)
                    : extractRows<T>(response.data);
                if (!active) {
                    return;
                }
                setRows(payload.rows ?? []);
                setMeta(payload.meta ?? null);
            } catch (err: any) {
                if (!active) {
                    return;
                }
                setError(err?.message ?? 'Unable to load data.');
                setRows([]);
                setMeta(null);
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };
        load();
        return () => {
            active = false;
        };
    }, [url, params, transformResponse, isClient]);

    const baseRows = useMemo(() => (isClient ? (data ?? []) : rows), [data, isClient, rows]);
    const filteredRows = useMemo(() => {
        let nextRows = baseRows;
        Object.entries(filterValues).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '') {
                return;
            }
            nextRows = nextRows.filter((row) => {
                const raw = (row as any)?.[key];
                if (Array.isArray(raw)) {
                    return raw.map(String).includes(String(value));
                }
                return String(raw ?? '') === String(value);
            });
        });
        if (!searchTerm) {
            return nextRows;
        }
        const term = searchTerm.toLowerCase();
        return nextRows.filter((row) => {
            return columns.some((col) => {
                const raw = col.accessor ? col.accessor(row) : (row as any)?.[col.key];
                if (raw === null || raw === undefined) {
                    return false;
                }
                if (Array.isArray(raw)) {
                    return raw.map(String).join(' ').toLowerCase().includes(term);
                }
                return String(raw).toLowerCase().includes(term);
            });
        });
    }, [baseRows, columns, filterValues, searchTerm]);

    const pagedRows = useMemo(() => {
        if (!isClient) {
            return rows;
        }
        const start = (page - 1) * pageSize;
        return filteredRows.slice(start, start + pageSize);
    }, [filteredRows, isClient, page, pageSize, rows]);

    const total = isClient ? filteredRows.length : meta?.total;
    const maxPage = total ? Math.max(1, Math.ceil(total / pageSize)) : null;
    const canPrev = page > 1 && !loading;
    const canNext = !loading && (maxPage ? page < maxPage : pagedRows.length === pageSize);

    const renderHeader = () => (
        <View style={[theme.styles.row, theme.utils.pysm, theme.utils.pxsm, { borderBottomWidth: 1, borderBottomColor: theme.color.border }]}>
            {columns.map((col) => (
                <View
                    key={col.key}
                    style={{
                        width: col.width,
                        flex: col.flex ?? (col.width ? 0 : 1),
                        paddingRight: 12,
                        ...(col.headerStyle as object),
                    }}>
                    <Text style={[theme.typography.variants.caption, { color: theme.color.muted, textAlign: col.align ?? 'left' }, col.headerTextStyle]}>
                        {col.title}
                    </Text>
                </View>
            ))}
        </View>
    );

    const renderRow = ({ item, index }: { item: T; index: number }) => (
        <View
            key={rowKey ? rowKey(item, index) : index}
            style={[
                theme.styles.row,
                theme.utils.pysm,
                theme.utils.pxsm,
                { borderBottomWidth: 1, borderBottomColor: theme.color.border },
            ]}
            onTouchEnd={onRowPress ? () => onRowPress(item) : undefined}>
            {columns.map((col) => {
                const value = col.render ? col.render(item) : col.accessor ? col.accessor(item) : (item as any)?.[col.key];
                return (
                    <View
                        key={col.key}
                        style={{
                            width: col.width,
                            flex: col.flex ?? (col.width ? 0 : 1),
                            paddingRight: 12,
                            ...(col.cellStyle as object),
                        }}>
                        {typeof value === 'string' || typeof value === 'number' || value === null || value === undefined ? (
                            <Text style={[{ color: theme.color.text, textAlign: col.align ?? 'left' }, col.cellTextStyle]}>
                                {value ?? '--'}
                            </Text>
                        ) : (
                            <View>{value}</View>
                        )}
                    </View>
                );
            })}
        </View>
    );

    return (
        <View style={[theme.styles.container, theme.styles.background]}>
            <View style={[theme.utils.pxmd, theme.utils.ptsm]}>
                <Text style={[theme.typography.variants.title, theme.utils.pbsm]}>{name}</Text>
                {searchable ? (
                    <FormInput
                        theme={theme}
                        placeholder={`Search ${name.toLowerCase()}...`}
                        value={searchInput}
                        onChangeText={setSearchInput}
                    />
                ) : null}
                {filters.length > 0 ? (
                    <View style={[theme.styles.row, { gap: 12, flexWrap: 'wrap' }]}> 
                        {filters.map((filter) => (
                            <View key={filter.key} style={{ minWidth: 160, flex: 1 }}>
                                <Dropdown
                                    theme={theme}
                                    options={filter.options}
                                    value={filterValues[filter.key]}
                                    placeholder={filter.placeholder ?? filter.label}
                                    onSelect={(val) => {
                                        setFilterValues((prev) => ({ ...prev, [filter.key]: val }));
                                    }}
                                />
                            </View>
                        ))}
                    </View>
                ) : null}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ minWidth: '100%' }}>
                    {renderHeader()}
                    {loading ? (
                        <View style={[theme.utils.pxmd, theme.utils.pymd]}>
                            <Text style={{ color: theme.color.muted }}>Loading...</Text>
                        </View>
                    ) : error ? (
                        <View style={[theme.utils.pxmd, theme.utils.pymd]}>
                            <Text style={{ color: theme.color.danger }}>{error}</Text>
                        </View>
                    ) : pagedRows.length === 0 ? (
                        <View style={[theme.utils.pxmd, theme.utils.pymd]}>
                            <Text style={{ color: theme.color.muted }}>No {name.toLowerCase()} found.</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={pagedRows}
                            keyExtractor={(item, index) => String(rowKey ? rowKey(item, index) : index)}
                            renderItem={renderRow}
                        />
                    )}
                </View>
            </ScrollView>

            <View style={[theme.styles.row, theme.styles.rowSpaceBetween, theme.utils.pxmd, theme.utils.pymd]}>
                <View style={[theme.styles.row, { gap: 8, alignItems: 'center' }]}> 
                    <Text style={{ color: theme.color.muted }}>Rows</Text>
                    <Dropdown
                        theme={theme}
                        value={pageSize}
                        options={pageSizeOptions.map((size) => ({
                            label: String(size),
                            value: size,
                        }))}
                        onSelect={(val) => setPageSize(Number(val))}
                        bordered
                        fieldStyle={{ minWidth: 80 }}
                    />
                </View>
                <View style={[theme.styles.row, { gap: 8, alignItems: 'center' }]}> 
                    <Button
                        title="Prev"
                        variant="outline"
                        size="sm"
                        disabled={!canPrev}
                        onPress={() => setPage((p) => Math.max(1, p - 1))}
                    />
                    <Text style={{ color: theme.color.muted }}>
                        Page {page}{maxPage ? ` of ${maxPage}` : ''}
                    </Text>
                    <Button
                        title="Next"
                        variant="outline"
                        size="sm"
                        disabled={!canNext}
                        onPress={() => setPage((p) => p + 1)}
                    />
                </View>
            </View>
        </View>
    );
}
