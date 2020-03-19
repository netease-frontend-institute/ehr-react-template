// 全局interface

// 操作类型
export type EditType = 0 | 1;

// 分页器参数
export interface PaginationProps {
    currentPage: number;
    total: number;
    pageSize?: number;
}

// 下拉列表的各项数据类型
export interface SelectListProps {
    value: string | number;
    label: string;
    disabled?: boolean;
}
