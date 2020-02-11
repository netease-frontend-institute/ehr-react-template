export interface DataWrapperProps {
    children: React.ReactNode;
    visibleIcon: boolean;
    visibleEmpty: boolean;
    className?: string;
    iconType?: string;
    emptyText?: string;
}

export interface NoDataProps {
    emptyText: string;
    visibleIcon: boolean;
    iconType?: string;
}
