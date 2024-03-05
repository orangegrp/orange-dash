type ApiDiscordChannel = {
    name: string;
    id: string;
};
type ApiDiscordUser = {
    name: string;
    id: string;
    icon: string | null;
};
declare enum ConfigValueType {
    string = 0,
    number = 1,
    integer = 2,
    user = 3,
    channel = 4,
    member = 5,
    object = 6
}
type ReturnValueType<Type extends ConfigValueType> = Type extends ConfigValueType.string ? string : Type extends ConfigValueType.number | ConfigValueType.integer ? number : Type extends ConfigValueType.member | ConfigValueType.user ? ApiDiscordUser : Type extends ConfigValueType.channel ? ApiDiscordChannel : Type extends ConfigValueType.object ? any : never;
type RealValueType<Type extends ConfigValueType> = Type extends ConfigValueType.number | ConfigValueType.integer ? number : Type extends ConfigValueType.object ? any : string;
type ConfigValueBase<Type extends ConfigValueType> = {
    /** Name of the value, displayed in settings UI */
    displayName: string;
    /** Description of the value, displayed in settings UI */
    description: string;
    /** If value should be visible in UI */
    uiVisibility?: "visible" | "readonly" | "hidden";
    /** Type of the value */
    type: Type;
} & ({
    /** Should this be an array of values? */
    array: true;
    /** Default value */
    default?: RealValueType<Type>[];
    /** Max number of values in the array */
    maxCount?: number;
    /** Array of values */
    value: ReturnValueType<Type>[] | null;
} | {
    array?: false | undefined;
    /** Default value */
    default?: RealValueType<Type>;
    /** Value */
    value: ReturnValueType<Type> | null;
});
type ConfigValueString = ConfigValueBase<ConfigValueType.string> & {
    /** Max length of the string */
    maxLength?: number;
    /** Min lenght of the string */
    minLength?: number;
    /** Choices for the string value (restrict to only these) */
    choices?: string[];
};
type ConfigValueNumber = ConfigValueBase<ConfigValueType.number> & {
    /** Max value of the number */
    maxValue?: number;
    /** Min value of the number */
    minValue?: number;
    /** Choices for the number value (restrict to only these) */
    choices?: number[];
};
type ConfigValueInteger = ConfigValueBase<ConfigValueType.integer> & {
    /** Max value of the integer */
    maxValue?: number;
    /** Min value of the integer */
    minValue?: number;
    /** Choices for the integer value (restrict to only these) */
    choices?: number[];
};
type ConfigValueUser = ConfigValueBase<ConfigValueType.user>;
type ConfigValueChannel = ConfigValueBase<ConfigValueType.channel>;
type ConfigValueMember = ConfigValueBase<ConfigValueType.member>;
type ConfigValueObject = ConfigValueBase<ConfigValueType.object> & {
    schema: any;
};
type ApiConfigValue = ConfigValueString | ConfigValueNumber | ConfigValueInteger | ConfigValueUser | ConfigValueChannel | ConfigValueMember | ConfigValueObject;
type Module = {
    module: string;
    displayName: string;
    values: ApiConfigValue[];
};
type SettingsList = Module[];
type ValueEdits = {
    [name: string]: RealValueType<ConfigValueType>;
};
declare enum ValueValidationResult {
    valid = "valid",
    invalid_module = "invalid_module",
    invalid_name = "invalid_name",
    invalid_type = "invalid_type",
    invalid_value = "invalid_value",
    no_permission = "no_permission"
}
type ValueValidationResults = {
    [key: string]: ValueValidationResult;
};
type ValueEditResult = {
    success: boolean;
    results: ValueValidationResults;
};
type ApiGuild = {
    id: string;
    name: string;
    nameAcronym: string;
    iconUrl: string | null;
};
declare enum ApiErrorType {
    fastify_error = "fastify_error",
    not_found = "not_found",
    unknown_error = "unknown_error",
    no_permission = "no_permission",
    invalid_snowflake = "invalid_snowflake",
    member_not_found = "member_not_found",
    guild_not_found = "guild_not_found",
    module_not_found = "module_not_found",
    invalid_edits = "invalid_edits"
}
type ApiError = {
    /** HTTP status code */
    readonly statusCode: number;
    /** Readable name for the error */
    readonly error: string;
    /** Readable message */
    readonly message: string;
    /** raw error (if any) */
    readonly raw?: string;
    /** Type of error */
    readonly type: ApiErrorType;
};
export type { SettingsList, ApiConfigValue, ValueEdits, ValueEditResult, ApiGuild, ApiError, ApiDiscordUser, ApiDiscordChannel };
export { ApiErrorType, ValueValidationResults, ValueValidationResult, ConfigValueType };
