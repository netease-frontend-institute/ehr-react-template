import { get } from '../../http';
import { OptionItem } from './interface';

export const getOption = (data: any) => get<OptionItem[]>({ url: '/option', data }); // 字典接口
