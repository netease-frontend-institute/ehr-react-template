export interface IRoute {
    link: string;
    title: string;
    component: Function;
    redirect?: string;
    sub?: IRoute[];
}
