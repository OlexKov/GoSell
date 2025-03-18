import { IUser } from "../models/account"
import { IOlxUser, IShortOlxUser } from "../models/user";
import { ICategory, ICategoryShort, ICategoryTreeElementModel } from "../models/category";
import { IAdvertPageRequest, IAdvertSearchPageData } from "../models/advert";
import { GetProp, UploadProps } from "antd";

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });


export const getUserDescr = (user: IUser | IOlxUser | IShortOlxUser | null | undefined): string => {
  return user?.firstName && user?.lastName ? `${user?.firstName} ${user?.lastName}` : user?.email || ''
}

export function stringToColor(string: string | null) {

  if (string) {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
      return color;
    }
  }
  return '#000000';
}

export const getDateTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

export const getTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString().slice(0, -3)
}

export const getFormData = (data: any): FormData => {
  const formData = new FormData();
  Object.keys(data).forEach(function (key) {
    if (Array.isArray(data[key])) {
      if (typeof data[key][0] === 'object' && !(data[key][0] instanceof File)) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        data[key].forEach((item: any) => formData.append(key, item));
      }
    } else if (typeof data[key] === 'object' && !(data[key] instanceof File)) {
      formData.append(key, JSON.stringify(data[key]));
    } else {
      formData.append(key, data[key]);
    }

  });
  return formData;
}

interface ICategoryCascaderElementNode {
  label: string,
  value: number,
  children: ICategoryCascaderElementNode[]
}

export const buildCascaderTree = (categories: ICategory[], parentId?: number): ICategoryCascaderElementNode[] => {
  return categories
    .filter(x => x.parentId == parentId)
    .map(x => {
      const children = buildCascaderTree(categories, x.id);
      return {
        label: x.name,
        value: x.id,
        children: children
      };
    });
};

export const buildTree = (categories: ICategory[], parentId?: number, disabled?: number[], disableParent?: boolean): ICategoryTreeElementModel[] => {
  return categories
    .filter(x => x.parentId == parentId)
    .map(x => {
      const children = buildTree(categories, x.id, disabled, disableParent);
      return {
        title: x.name,
        value: x.id,
        key: x.id,
        disabled: disabled?.includes(x.id) || (disableParent !== undefined && disableParent === (children.length !== 0)),
        children: children
      };
    });
};

export const getAllParentFilterIds = (categories: ICategory[], parentId?: number): number[] => {
  let filtersIds: number[] = [];
  while (parentId) {
    const parentCategory = categories.find(x => x.id == parentId);
    if (parentCategory) {
      filtersIds.push(...parentCategory.filters)
    }
    parentId = parentCategory?.parentId;
  }
  return filtersIds
}

export const getLastChildrenCategoriesIds = (categories: ICategory[], categoryId?: number): number[] => {
  const categoriesIds: number[] = [];
  const childCategories = categories.filter(x => x.parentId === categoryId);
  if (childCategories.length > 0) {
    childCategories.forEach(child => {
      categoriesIds.push(...getLastChildrenCategoriesIds(categories, child.id));
    });
  } else if (categoryId !== undefined) {
    categoriesIds.push(categoryId);
  }
  return categoriesIds;
};

export const getAllParents = (categories: ICategory[], parentId?: number): ICategoryShort[] => {
  const parentIds: ICategoryShort[] = [];
  if (parentId) {
    const parent = categories.find(x => x.id === parentId)
    parentIds.push({ id: parentId, name: parent?.name })
    parentIds.push(...getAllParents(categories, parent?.parentId))
  }
  return parentIds;
};

export const getAllParentsIds = (categories: ICategory[], parentId?: number): number[] => {
  const parentIds: number[] = [];
  if (parentId) {
    const parent = categories.find(x => x.id === parentId)
    parentIds.push(parentId)
    parentIds.push(...getAllParentsIds(categories, parent?.parentId))
  }
  return parentIds;
};


export const getQueryString = (filter: any): string => {
  var result = '';
  Object.keys(filter).forEach((key) => {
    if (typeof (filter[key]) === "string") {
      filter[key] = (filter[key] as string).trim()
    }
    if (filter[key] !== null && filter[key] !== undefined && filter[key].length !== 0) {
      var value = typeof (filter[key]) === "object"
        ? JSON.stringify(filter[key])
        : filter[key];
      var symbol = result === '' ? '?' : '&'
      result += `${symbol + key}=${value}`
    }
  });
  return result;
}

export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max))

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('uk-UA').format(price);
};

export const formattedDate = (date: Date) => date.toLocaleDateString('uk-UA', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
}).replace(/(\d+) (\w+) (\d+)/, '$1 $2 $3 р.');

export const getFormatDateTime = (date?: Date): string => {
  const today: Date = new Date();
  if (!date) {
    date = today
  }
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const time = date.toLocaleTimeString().slice(0, -3);

  if (today.toDateString() === date.toDateString()) {
    return `согодні в ${time}`
  }
  if (yesterday.toDateString() === date.toDateString()) {
    return `вчора в ${time}`
  }
  if (date.getFullYear() < today.getFullYear()) {
    return formattedDate(date)
  }
  return `${formattedDate(date).slice(0, -7)} в ${time}`
}

export const getFormatDate = (date?: Date): string => {
  const today: Date = new Date();
  if (!date) {
    date = today
  }
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (today.toDateString() === date.toDateString()) {
    return `согодні`
  }
  if (yesterday.toDateString() === date.toDateString()) {
    return `вчора`
  }
  if (date.getFullYear() < today.getFullYear()) {
    return formattedDate(date)
  }
  return `${formattedDate(date).slice(0, -7)}`
}

export const getAdvertPageRequest = (pageData: IAdvertSearchPageData, categories: ICategory[]): IAdvertPageRequest => {
  const { categoryId, ...rest } = pageData;
  const result = {
    ...rest,
    categoryIds: getLastChildrenCategoriesIds(categories, pageData.categoryId)
  }
  return result;
}

export const formatBytes = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}