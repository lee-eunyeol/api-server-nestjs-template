export const EnumSwaggerUtil = (enumType: any) => [...Object.values(enumType)].filter((o) => typeof o === 'number');
