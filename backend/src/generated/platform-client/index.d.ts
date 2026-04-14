/**
 * Client
 **/

import * as runtime from './runtime/library.js'
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>

/**
 * Model Tenant
 *
 */
export type Tenant = $Result.DefaultSelection<Prisma.$TenantPayload>
/**
 * Model TenantAuditLog
 *
 */
export type TenantAuditLog = $Result.DefaultSelection<Prisma.$TenantAuditLogPayload>
/**
 * Model SuperAdmin
 *
 */
export type SuperAdmin = $Result.DefaultSelection<Prisma.$SuperAdminPayload>
/**
 * Model OtpSession
 *
 */
export type OtpSession = $Result.DefaultSelection<Prisma.$OtpSessionPayload>
/**
 * Model RefreshToken
 *
 */
export type RefreshToken = $Result.DefaultSelection<Prisma.$RefreshTokenPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TenantStatus: {
    active: 'active'
    trial: 'trial'
    suspended: 'suspended'
    cancelled: 'cancelled'
  }

  export type TenantStatus = (typeof TenantStatus)[keyof typeof TenantStatus]

  export const TenantType: {
    school: 'school'
    college: 'college'
    coaching: 'coaching'
  }

  export type TenantType = (typeof TenantType)[keyof typeof TenantType]

  export const SubscriptionPlan: {
    basic: 'basic'
    standard: 'standard'
    premium: 'premium'
    enterprise: 'enterprise'
  }

  export type SubscriptionPlan = (typeof SubscriptionPlan)[keyof typeof SubscriptionPlan]

  export const OtpPurpose: {
    login: 'login'
  }

  export type OtpPurpose = (typeof OtpPurpose)[keyof typeof OtpPurpose]
}

export type TenantStatus = $Enums.TenantStatus

export const TenantStatus: typeof $Enums.TenantStatus

export type TenantType = $Enums.TenantType

export const TenantType: typeof $Enums.TenantType

export type SubscriptionPlan = $Enums.SubscriptionPlan

export const SubscriptionPlan: typeof $Enums.SubscriptionPlan

export type OtpPurpose = $Enums.OtpPurpose

export const OtpPurpose: typeof $Enums.OtpPurpose

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Tenants
 * const tenants = await prisma.tenant.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions
    ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<ClientOptions['log']>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Tenants
   * const tenants = await prisma.tenant.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>)
  $on<V extends U>(
    eventType: V,
    callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void,
  ): PrismaClient

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: { isolationLevel?: Prisma.TransactionIsolationLevel },
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(
    fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>,
    options?: { maxWait?: number; timeout?: number; isolationLevel?: Prisma.TransactionIsolationLevel },
  ): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<
    'extends',
    Prisma.TypeMapCb<ClientOptions>,
    ExtArgs,
    $Utils.Call<
      Prisma.TypeMapCb<ClientOptions>,
      {
        extArgs: ExtArgs
      }
    >
  >

  /**
   * `prisma.tenant`: Exposes CRUD operations for the **Tenant** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Tenants
   * const tenants = await prisma.tenant.findMany()
   * ```
   */
  get tenant(): Prisma.TenantDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.tenantAuditLog`: Exposes CRUD operations for the **TenantAuditLog** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more TenantAuditLogs
   * const tenantAuditLogs = await prisma.tenantAuditLog.findMany()
   * ```
   */
  get tenantAuditLog(): Prisma.TenantAuditLogDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.superAdmin`: Exposes CRUD operations for the **SuperAdmin** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more SuperAdmins
   * const superAdmins = await prisma.superAdmin.findMany()
   * ```
   */
  get superAdmin(): Prisma.SuperAdminDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.otpSession`: Exposes CRUD operations for the **OtpSession** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more OtpSessions
   * const otpSessions = await prisma.otpSession.findMany()
   * ```
   */
  get otpSession(): Prisma.OtpSessionDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.refreshToken`: Exposes CRUD operations for the **RefreshToken** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more RefreshTokens
   * const refreshTokens = await prisma.refreshToken.findMany()
   * ```
   */
  get refreshToken(): Prisma.RefreshTokenDelegate<ExtArgs, ClientOptions>
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
   * Extensions
   */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.16.0
   * Query Engine version: 1c57fdcd7e44b29b9313256c76699e91c3ac3c43
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */

  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
     * Type of `Prisma.DbNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P]
  }

  export type Enumerable<T> = T | Array<T>

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  }

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } & (T extends SelectAndInclude
    ? 'Please either choose `select` or `include`.'
    : T extends SelectAndOmit
      ? 'Please either choose `select` or `omit`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } & K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object ? (U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U) : T

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> =
    T extends Array<any>
      ? False
      : T extends Date
        ? False
        : T extends Uint8Array
          ? False
          : T extends bigint
            ? False
            : T extends object
              ? True
              : False

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown
    ? _Either<O, K, strict>
    : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K]
  } & {}

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>
      }
    >
  >

  type Key = string | number | symbol
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never
  type AtStrict<O extends object, K extends Key> = O[K & keyof O]
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>
    0: AtLoose<O, K>
  }[strict]

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K]
      } & {}

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K]
  } & {}

  type _Record<K extends keyof any, T> = {
    [P in K]: T
  }

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ? (K extends keyof O ? { [P in K]: O[P] } & O : O) | ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O)
      : never
  >

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
      ? 1
      : 0

  export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B

  export const type: unique symbol

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never
      }
    : never

  type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
        ? never
        : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>

  export const ModelName: {
    Tenant: 'Tenant'
    TenantAuditLog: 'TenantAuditLog'
    SuperAdmin: 'SuperAdmin'
    OtpSession: 'OtpSession'
    RefreshToken: 'RefreshToken'
  }

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]

  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<
    { extArgs: $Extensions.InternalArgs },
    $Utils.Record<string, any>
  > {
    returns: Prisma.TypeMap<
      this['params']['extArgs'],
      ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}
    >
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: 'tenant' | 'tenantAuditLog' | 'superAdmin' | 'otpSession' | 'refreshToken'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Tenant: {
        payload: Prisma.$TenantPayload<ExtArgs>
        fields: Prisma.TenantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findFirst: {
            args: Prisma.TenantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findMany: {
            args: Prisma.TenantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          create: {
            args: Prisma.TenantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          createMany: {
            args: Prisma.TenantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          delete: {
            args: Prisma.TenantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          update: {
            args: Prisma.TenantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          deleteMany: {
            args: Prisma.TenantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TenantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          upsert: {
            args: Prisma.TenantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          aggregate: {
            args: Prisma.TenantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenant>
          }
          groupBy: {
            args: Prisma.TenantGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantCountArgs<ExtArgs>
            result: $Utils.Optional<TenantCountAggregateOutputType> | number
          }
        }
      }
      TenantAuditLog: {
        payload: Prisma.$TenantAuditLogPayload<ExtArgs>
        fields: Prisma.TenantAuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantAuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantAuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantAuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantAuditLogPayload>
          }
          findFirst: {
            args: Prisma.TenantAuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantAuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantAuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantAuditLogPayload>
          }
          findMany: {
            args: Prisma.TenantAuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantAuditLogPayload>[]
          }
          create: {
            args: Prisma.TenantAuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantAuditLogPayload>
          }
          createMany: {
            args: Prisma.TenantAuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantAuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantAuditLogPayload>[]
          }
          delete: {
            args: Prisma.TenantAuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantAuditLogPayload>
          }
          update: {
            args: Prisma.TenantAuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantAuditLogPayload>
          }
          deleteMany: {
            args: Prisma.TenantAuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantAuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TenantAuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantAuditLogPayload>[]
          }
          upsert: {
            args: Prisma.TenantAuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantAuditLogPayload>
          }
          aggregate: {
            args: Prisma.TenantAuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenantAuditLog>
          }
          groupBy: {
            args: Prisma.TenantAuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantAuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantAuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<TenantAuditLogCountAggregateOutputType> | number
          }
        }
      }
      SuperAdmin: {
        payload: Prisma.$SuperAdminPayload<ExtArgs>
        fields: Prisma.SuperAdminFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SuperAdminFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SuperAdminFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          findFirst: {
            args: Prisma.SuperAdminFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SuperAdminFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          findMany: {
            args: Prisma.SuperAdminFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>[]
          }
          create: {
            args: Prisma.SuperAdminCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          createMany: {
            args: Prisma.SuperAdminCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SuperAdminCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>[]
          }
          delete: {
            args: Prisma.SuperAdminDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          update: {
            args: Prisma.SuperAdminUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          deleteMany: {
            args: Prisma.SuperAdminDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SuperAdminUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SuperAdminUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>[]
          }
          upsert: {
            args: Prisma.SuperAdminUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          aggregate: {
            args: Prisma.SuperAdminAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSuperAdmin>
          }
          groupBy: {
            args: Prisma.SuperAdminGroupByArgs<ExtArgs>
            result: $Utils.Optional<SuperAdminGroupByOutputType>[]
          }
          count: {
            args: Prisma.SuperAdminCountArgs<ExtArgs>
            result: $Utils.Optional<SuperAdminCountAggregateOutputType> | number
          }
        }
      }
      OtpSession: {
        payload: Prisma.$OtpSessionPayload<ExtArgs>
        fields: Prisma.OtpSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OtpSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OtpSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpSessionPayload>
          }
          findFirst: {
            args: Prisma.OtpSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OtpSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpSessionPayload>
          }
          findMany: {
            args: Prisma.OtpSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpSessionPayload>[]
          }
          create: {
            args: Prisma.OtpSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpSessionPayload>
          }
          createMany: {
            args: Prisma.OtpSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OtpSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpSessionPayload>[]
          }
          delete: {
            args: Prisma.OtpSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpSessionPayload>
          }
          update: {
            args: Prisma.OtpSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpSessionPayload>
          }
          deleteMany: {
            args: Prisma.OtpSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OtpSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OtpSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpSessionPayload>[]
          }
          upsert: {
            args: Prisma.OtpSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OtpSessionPayload>
          }
          aggregate: {
            args: Prisma.OtpSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOtpSession>
          }
          groupBy: {
            args: Prisma.OtpSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<OtpSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.OtpSessionCountArgs<ExtArgs>
            result: $Utils.Optional<OtpSessionCountAggregateOutputType> | number
          }
        }
      }
      RefreshToken: {
        payload: Prisma.$RefreshTokenPayload<ExtArgs>
        fields: Prisma.RefreshTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RefreshTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RefreshTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          findFirst: {
            args: Prisma.RefreshTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RefreshTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          findMany: {
            args: Prisma.RefreshTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          create: {
            args: Prisma.RefreshTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          createMany: {
            args: Prisma.RefreshTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RefreshTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          delete: {
            args: Prisma.RefreshTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          update: {
            args: Prisma.RefreshTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          deleteMany: {
            args: Prisma.RefreshTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RefreshTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RefreshTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>[]
          }
          upsert: {
            args: Prisma.RefreshTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RefreshTokenPayload>
          }
          aggregate: {
            args: Prisma.RefreshTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRefreshToken>
          }
          groupBy: {
            args: Prisma.RefreshTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<RefreshTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.RefreshTokenCountArgs<ExtArgs>
            result: $Utils.Optional<RefreshTokenCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]]
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]]
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]]
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]]
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     *
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     *
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    tenant?: TenantOmit
    tenantAuditLog?: TenantAuditLogOmit
    superAdmin?: SuperAdminOmit
    otpSession?: OtpSessionOmit
    refreshToken?: RefreshTokenOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never

  export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */

  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */

  /**
   * Count Type TenantCountOutputType
   */

  export type TenantCountOutputType = {
    auditLogs: number
  }

  export type TenantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditLogs?: boolean | TenantCountOutputTypeCountAuditLogsArgs
  }

  // Custom InputTypes
  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantCountOutputType
     */
    select?: TenantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountAuditLogsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    where?: TenantAuditLogWhereInput
  }

  /**
   * Models
   */

  /**
   * Model Tenant
   */

  export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null
    _avg: TenantAvgAggregateOutputType | null
    _sum: TenantSumAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  export type TenantAvgAggregateOutputType = {
    dbPort: number | null
    monthlyFeeInr: Decimal | null
    totalStudents: number | null
    totalStaff: number | null
  }

  export type TenantSumAggregateOutputType = {
    dbPort: number | null
    monthlyFeeInr: Decimal | null
    totalStudents: number | null
    totalStaff: number | null
  }

  export type TenantMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    slug: string | null
    type: $Enums.TenantType | null
    board: string | null
    logoUrl: string | null
    city: string | null
    state: string | null
    country: string | null
    address: string | null
    pincode: string | null
    phone: string | null
    dbName: string | null
    dbHost: string | null
    dbPort: number | null
    plan: $Enums.SubscriptionPlan | null
    status: $Enums.TenantStatus | null
    trialEndsAt: Date | null
    subscriptionStart: Date | null
    subscriptionEnd: Date | null
    monthlyFeeInr: Decimal | null
    adminName: string | null
    adminEmail: string | null
    adminPhone: string | null
    totalStudents: number | null
    totalStaff: number | null
    institutionCode: string | null
  }

  export type TenantMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    name: string | null
    slug: string | null
    type: $Enums.TenantType | null
    board: string | null
    logoUrl: string | null
    city: string | null
    state: string | null
    country: string | null
    address: string | null
    pincode: string | null
    phone: string | null
    dbName: string | null
    dbHost: string | null
    dbPort: number | null
    plan: $Enums.SubscriptionPlan | null
    status: $Enums.TenantStatus | null
    trialEndsAt: Date | null
    subscriptionStart: Date | null
    subscriptionEnd: Date | null
    monthlyFeeInr: Decimal | null
    adminName: string | null
    adminEmail: string | null
    adminPhone: string | null
    totalStudents: number | null
    totalStaff: number | null
    institutionCode: string | null
  }

  export type TenantCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    name: number
    slug: number
    type: number
    board: number
    logoUrl: number
    city: number
    state: number
    country: number
    address: number
    pincode: number
    phone: number
    dbName: number
    dbHost: number
    dbPort: number
    plan: number
    status: number
    trialEndsAt: number
    subscriptionStart: number
    subscriptionEnd: number
    monthlyFeeInr: number
    adminName: number
    adminEmail: number
    adminPhone: number
    totalStudents: number
    totalStaff: number
    institutionCode: number
    _all: number
  }

  export type TenantAvgAggregateInputType = {
    dbPort?: true
    monthlyFeeInr?: true
    totalStudents?: true
    totalStaff?: true
  }

  export type TenantSumAggregateInputType = {
    dbPort?: true
    monthlyFeeInr?: true
    totalStudents?: true
    totalStaff?: true
  }

  export type TenantMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    slug?: true
    type?: true
    board?: true
    logoUrl?: true
    city?: true
    state?: true
    country?: true
    address?: true
    pincode?: true
    phone?: true
    dbName?: true
    dbHost?: true
    dbPort?: true
    plan?: true
    status?: true
    trialEndsAt?: true
    subscriptionStart?: true
    subscriptionEnd?: true
    monthlyFeeInr?: true
    adminName?: true
    adminEmail?: true
    adminPhone?: true
    totalStudents?: true
    totalStaff?: true
    institutionCode?: true
  }

  export type TenantMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    slug?: true
    type?: true
    board?: true
    logoUrl?: true
    city?: true
    state?: true
    country?: true
    address?: true
    pincode?: true
    phone?: true
    dbName?: true
    dbHost?: true
    dbPort?: true
    plan?: true
    status?: true
    trialEndsAt?: true
    subscriptionStart?: true
    subscriptionEnd?: true
    monthlyFeeInr?: true
    adminName?: true
    adminEmail?: true
    adminPhone?: true
    totalStudents?: true
    totalStaff?: true
    institutionCode?: true
  }

  export type TenantCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    name?: true
    slug?: true
    type?: true
    board?: true
    logoUrl?: true
    city?: true
    state?: true
    country?: true
    address?: true
    pincode?: true
    phone?: true
    dbName?: true
    dbHost?: true
    dbPort?: true
    plan?: true
    status?: true
    trialEndsAt?: true
    subscriptionStart?: true
    subscriptionEnd?: true
    monthlyFeeInr?: true
    adminName?: true
    adminEmail?: true
    adminPhone?: true
    totalStudents?: true
    totalStaff?: true
    institutionCode?: true
    _all?: true
  }

  export type TenantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenant to aggregate.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Tenants
     **/
    _count?: true | TenantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: TenantAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: TenantSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: TenantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: TenantMaxAggregateInputType
  }

  export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
    [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenant[P]>
      : GetScalarType<T[P], AggregateTenant[P]>
  }

  export type TenantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
    orderBy?: TenantOrderByWithAggregationInput | TenantOrderByWithAggregationInput[]
    by: TenantScalarFieldEnum[] | TenantScalarFieldEnum
    having?: TenantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantCountAggregateInputType | true
    _avg?: TenantAvgAggregateInputType
    _sum?: TenantSumAggregateInputType
    _min?: TenantMinAggregateInputType
    _max?: TenantMaxAggregateInputType
  }

  export type TenantGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    name: string
    slug: string
    type: $Enums.TenantType
    board: string | null
    logoUrl: string | null
    city: string
    state: string
    country: string
    address: string | null
    pincode: string | null
    phone: string | null
    dbName: string
    dbHost: string
    dbPort: number
    plan: $Enums.SubscriptionPlan
    status: $Enums.TenantStatus
    trialEndsAt: Date | null
    subscriptionStart: Date | null
    subscriptionEnd: Date | null
    monthlyFeeInr: Decimal | null
    adminName: string
    adminEmail: string
    adminPhone: string | null
    totalStudents: number
    totalStaff: number
    institutionCode: string
    _count: TenantCountAggregateOutputType | null
    _avg: TenantAvgAggregateOutputType | null
    _sum: TenantSumAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantGroupByOutputType, T['by']> & {
        [P in keyof T & keyof TenantGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], TenantGroupByOutputType[P]>
          : GetScalarType<T[P], TenantGroupByOutputType[P]>
      }
    >
  >

  export type TenantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<
    {
      id?: boolean
      createdAt?: boolean
      updatedAt?: boolean
      name?: boolean
      slug?: boolean
      type?: boolean
      board?: boolean
      logoUrl?: boolean
      city?: boolean
      state?: boolean
      country?: boolean
      address?: boolean
      pincode?: boolean
      phone?: boolean
      dbName?: boolean
      dbHost?: boolean
      dbPort?: boolean
      plan?: boolean
      status?: boolean
      trialEndsAt?: boolean
      subscriptionStart?: boolean
      subscriptionEnd?: boolean
      monthlyFeeInr?: boolean
      adminName?: boolean
      adminEmail?: boolean
      adminPhone?: boolean
      totalStudents?: boolean
      totalStaff?: boolean
      institutionCode?: boolean
      auditLogs?: boolean | Tenant$auditLogsArgs<ExtArgs>
      _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['tenant']
  >

  export type TenantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean
        createdAt?: boolean
        updatedAt?: boolean
        name?: boolean
        slug?: boolean
        type?: boolean
        board?: boolean
        logoUrl?: boolean
        city?: boolean
        state?: boolean
        country?: boolean
        address?: boolean
        pincode?: boolean
        phone?: boolean
        dbName?: boolean
        dbHost?: boolean
        dbPort?: boolean
        plan?: boolean
        status?: boolean
        trialEndsAt?: boolean
        subscriptionStart?: boolean
        subscriptionEnd?: boolean
        monthlyFeeInr?: boolean
        adminName?: boolean
        adminEmail?: boolean
        adminPhone?: boolean
        totalStudents?: boolean
        totalStaff?: boolean
        institutionCode?: boolean
      },
      ExtArgs['result']['tenant']
    >

  export type TenantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean
        createdAt?: boolean
        updatedAt?: boolean
        name?: boolean
        slug?: boolean
        type?: boolean
        board?: boolean
        logoUrl?: boolean
        city?: boolean
        state?: boolean
        country?: boolean
        address?: boolean
        pincode?: boolean
        phone?: boolean
        dbName?: boolean
        dbHost?: boolean
        dbPort?: boolean
        plan?: boolean
        status?: boolean
        trialEndsAt?: boolean
        subscriptionStart?: boolean
        subscriptionEnd?: boolean
        monthlyFeeInr?: boolean
        adminName?: boolean
        adminEmail?: boolean
        adminPhone?: boolean
        totalStudents?: boolean
        totalStaff?: boolean
        institutionCode?: boolean
      },
      ExtArgs['result']['tenant']
    >

  export type TenantSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    name?: boolean
    slug?: boolean
    type?: boolean
    board?: boolean
    logoUrl?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    address?: boolean
    pincode?: boolean
    phone?: boolean
    dbName?: boolean
    dbHost?: boolean
    dbPort?: boolean
    plan?: boolean
    status?: boolean
    trialEndsAt?: boolean
    subscriptionStart?: boolean
    subscriptionEnd?: boolean
    monthlyFeeInr?: boolean
    adminName?: boolean
    adminEmail?: boolean
    adminPhone?: boolean
    totalStudents?: boolean
    totalStaff?: boolean
    institutionCode?: boolean
  }

  export type TenantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'name'
    | 'slug'
    | 'type'
    | 'board'
    | 'logoUrl'
    | 'city'
    | 'state'
    | 'country'
    | 'address'
    | 'pincode'
    | 'phone'
    | 'dbName'
    | 'dbHost'
    | 'dbPort'
    | 'plan'
    | 'status'
    | 'trialEndsAt'
    | 'subscriptionStart'
    | 'subscriptionEnd'
    | 'monthlyFeeInr'
    | 'adminName'
    | 'adminEmail'
    | 'adminPhone'
    | 'totalStudents'
    | 'totalStaff'
    | 'institutionCode',
    ExtArgs['result']['tenant']
  >
  export type TenantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditLogs?: boolean | Tenant$auditLogsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TenantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TenantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TenantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'Tenant'
    objects: {
      auditLogs: Prisma.$TenantAuditLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: string
        createdAt: Date
        updatedAt: Date
        name: string
        slug: string
        type: $Enums.TenantType
        board: string | null
        logoUrl: string | null
        city: string
        state: string
        country: string
        address: string | null
        pincode: string | null
        phone: string | null
        dbName: string
        dbHost: string
        dbPort: number
        plan: $Enums.SubscriptionPlan
        status: $Enums.TenantStatus
        trialEndsAt: Date | null
        subscriptionStart: Date | null
        subscriptionEnd: Date | null
        monthlyFeeInr: Prisma.Decimal | null
        adminName: string
        adminEmail: string
        adminPhone: string | null
        totalStudents: number
        totalStaff: number
        institutionCode: string
      },
      ExtArgs['result']['tenant']
    >
    composites: {}
  }

  type TenantGetPayload<S extends boolean | null | undefined | TenantDefaultArgs> = $Result.GetResult<
    Prisma.$TenantPayload,
    S
  >

  type TenantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    TenantFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: TenantCountAggregateInputType | true
  }

  export interface TenantDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tenant']; meta: { name: 'Tenant' } }
    /**
     * Find zero or one Tenant that matches the filter.
     * @param {TenantFindUniqueArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantFindUniqueArgs>(
      args: SelectSubset<T, TenantFindUniqueArgs<ExtArgs>>,
    ): Prisma__TenantClient<
      $Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one Tenant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantFindUniqueOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantFindUniqueOrThrowArgs>(
      args: SelectSubset<T, TenantFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__TenantClient<
      $Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first Tenant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantFindFirstArgs>(
      args?: SelectSubset<T, TenantFindFirstArgs<ExtArgs>>,
    ): Prisma__TenantClient<
      $Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first Tenant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantFindFirstOrThrowArgs>(
      args?: SelectSubset<T, TenantFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__TenantClient<
      $Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more Tenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tenants
     * const tenants = await prisma.tenant.findMany()
     *
     * // Get first 10 Tenants
     * const tenants = await prisma.tenant.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const tenantWithIdOnly = await prisma.tenant.findMany({ select: { id: true } })
     *
     */
    findMany<T extends TenantFindManyArgs>(
      args?: SelectSubset<T, TenantFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>>

    /**
     * Create a Tenant.
     * @param {TenantCreateArgs} args - Arguments to create a Tenant.
     * @example
     * // Create one Tenant
     * const Tenant = await prisma.tenant.create({
     *   data: {
     *     // ... data to create a Tenant
     *   }
     * })
     *
     */
    create<T extends TenantCreateArgs>(
      args: SelectSubset<T, TenantCreateArgs<ExtArgs>>,
    ): Prisma__TenantClient<
      $Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many Tenants.
     * @param {TenantCreateManyArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends TenantCreateManyArgs>(
      args?: SelectSubset<T, TenantCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tenants and returns the data saved in the database.
     * @param {TenantCreateManyAndReturnArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends TenantCreateManyAndReturnArgs>(
      args?: SelectSubset<T, TenantCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'createManyAndReturn', GlobalOmitOptions>
    >

    /**
     * Delete a Tenant.
     * @param {TenantDeleteArgs} args - Arguments to delete one Tenant.
     * @example
     * // Delete one Tenant
     * const Tenant = await prisma.tenant.delete({
     *   where: {
     *     // ... filter to delete one Tenant
     *   }
     * })
     *
     */
    delete<T extends TenantDeleteArgs>(
      args: SelectSubset<T, TenantDeleteArgs<ExtArgs>>,
    ): Prisma__TenantClient<
      $Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one Tenant.
     * @param {TenantUpdateArgs} args - Arguments to update one Tenant.
     * @example
     * // Update one Tenant
     * const tenant = await prisma.tenant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends TenantUpdateArgs>(
      args: SelectSubset<T, TenantUpdateArgs<ExtArgs>>,
    ): Prisma__TenantClient<
      $Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more Tenants.
     * @param {TenantDeleteManyArgs} args - Arguments to filter Tenants to delete.
     * @example
     * // Delete a few Tenants
     * const { count } = await prisma.tenant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends TenantDeleteManyArgs>(
      args?: SelectSubset<T, TenantDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends TenantUpdateManyArgs>(
      args: SelectSubset<T, TenantUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants and returns the data updated in the database.
     * @param {TenantUpdateManyAndReturnArgs} args - Arguments to update many Tenants.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends TenantUpdateManyAndReturnArgs>(
      args: SelectSubset<T, TenantUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'updateManyAndReturn', GlobalOmitOptions>
    >

    /**
     * Create or update one Tenant.
     * @param {TenantUpsertArgs} args - Arguments to update or create a Tenant.
     * @example
     * // Update or create a Tenant
     * const tenant = await prisma.tenant.upsert({
     *   create: {
     *     // ... data to create a Tenant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tenant we want to update
     *   }
     * })
     */
    upsert<T extends TenantUpsertArgs>(
      args: SelectSubset<T, TenantUpsertArgs<ExtArgs>>,
    ): Prisma__TenantClient<
      $Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantCountArgs} args - Arguments to filter Tenants to count.
     * @example
     * // Count the number of Tenants
     * const count = await prisma.tenant.count({
     *   where: {
     *     // ... the filter for the Tenants we want to count
     *   }
     * })
     **/
    count<T extends TenantCountArgs>(
      args?: Subset<T, TenantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends TenantAggregateArgs>(
      args: Subset<T, TenantAggregateArgs>,
    ): Prisma.PrismaPromise<GetTenantAggregateType<T>>

    /**
     * Group by Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends TenantGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantGroupByArgs['orderBy'] }
        : { orderBy?: TenantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the Tenant model
     */
    readonly fields: TenantFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tenant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    auditLogs<T extends Tenant$auditLogsArgs<ExtArgs> = {}>(
      args?: Subset<T, Tenant$auditLogsArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$TenantAuditLogPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions> | Null
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the Tenant model
   */
  interface TenantFieldRefs {
    readonly id: FieldRef<'Tenant', 'String'>
    readonly createdAt: FieldRef<'Tenant', 'DateTime'>
    readonly updatedAt: FieldRef<'Tenant', 'DateTime'>
    readonly name: FieldRef<'Tenant', 'String'>
    readonly slug: FieldRef<'Tenant', 'String'>
    readonly type: FieldRef<'Tenant', 'TenantType'>
    readonly board: FieldRef<'Tenant', 'String'>
    readonly logoUrl: FieldRef<'Tenant', 'String'>
    readonly city: FieldRef<'Tenant', 'String'>
    readonly state: FieldRef<'Tenant', 'String'>
    readonly country: FieldRef<'Tenant', 'String'>
    readonly address: FieldRef<'Tenant', 'String'>
    readonly pincode: FieldRef<'Tenant', 'String'>
    readonly phone: FieldRef<'Tenant', 'String'>
    readonly dbName: FieldRef<'Tenant', 'String'>
    readonly dbHost: FieldRef<'Tenant', 'String'>
    readonly dbPort: FieldRef<'Tenant', 'Int'>
    readonly plan: FieldRef<'Tenant', 'SubscriptionPlan'>
    readonly status: FieldRef<'Tenant', 'TenantStatus'>
    readonly trialEndsAt: FieldRef<'Tenant', 'DateTime'>
    readonly subscriptionStart: FieldRef<'Tenant', 'DateTime'>
    readonly subscriptionEnd: FieldRef<'Tenant', 'DateTime'>
    readonly monthlyFeeInr: FieldRef<'Tenant', 'Decimal'>
    readonly adminName: FieldRef<'Tenant', 'String'>
    readonly adminEmail: FieldRef<'Tenant', 'String'>
    readonly adminPhone: FieldRef<'Tenant', 'String'>
    readonly totalStudents: FieldRef<'Tenant', 'Int'>
    readonly totalStaff: FieldRef<'Tenant', 'Int'>
    readonly institutionCode: FieldRef<'Tenant', 'String'>
  }

  // Custom InputTypes
  /**
   * Tenant findUnique
   */
  export type TenantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findUniqueOrThrow
   */
  export type TenantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findFirst
   */
  export type TenantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findFirstOrThrow
   */
  export type TenantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findMany
   */
  export type TenantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenants to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Tenants.
     */
    skip?: number
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant create
   */
  export type TenantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to create a Tenant.
     */
    data: XOR<TenantCreateInput, TenantUncheckedCreateInput>
  }

  /**
   * Tenant createMany
   */
  export type TenantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant createManyAndReturn
   */
  export type TenantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant update
   */
  export type TenantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to update a Tenant.
     */
    data: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
    /**
     * Choose, which Tenant to update.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant updateMany
   */
  export type TenantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
  }

  /**
   * Tenant updateManyAndReturn
   */
  export type TenantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
  }

  /**
   * Tenant upsert
   */
  export type TenantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The filter to search for the Tenant to update in case it exists.
     */
    where: TenantWhereUniqueInput
    /**
     * In case the Tenant found by the `where` argument doesn't exist, create a new Tenant with this data.
     */
    create: XOR<TenantCreateInput, TenantUncheckedCreateInput>
    /**
     * In case the Tenant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
  }

  /**
   * Tenant delete
   */
  export type TenantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter which Tenant to delete.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant deleteMany
   */
  export type TenantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenants to delete
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to delete.
     */
    limit?: number
  }

  /**
   * Tenant.auditLogs
   */
  export type Tenant$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAuditLog
     */
    select?: TenantAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAuditLog
     */
    omit?: TenantAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAuditLogInclude<ExtArgs> | null
    where?: TenantAuditLogWhereInput
    orderBy?: TenantAuditLogOrderByWithRelationInput | TenantAuditLogOrderByWithRelationInput[]
    cursor?: TenantAuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TenantAuditLogScalarFieldEnum | TenantAuditLogScalarFieldEnum[]
  }

  /**
   * Tenant without action
   */
  export type TenantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
  }

  /**
   * Model TenantAuditLog
   */

  export type AggregateTenantAuditLog = {
    _count: TenantAuditLogCountAggregateOutputType | null
    _avg: TenantAuditLogAvgAggregateOutputType | null
    _sum: TenantAuditLogSumAggregateOutputType | null
    _min: TenantAuditLogMinAggregateOutputType | null
    _max: TenantAuditLogMaxAggregateOutputType | null
  }

  export type TenantAuditLogAvgAggregateOutputType = {
    id: number | null
  }

  export type TenantAuditLogSumAggregateOutputType = {
    id: bigint | null
  }

  export type TenantAuditLogMinAggregateOutputType = {
    id: bigint | null
    createdAt: Date | null
    tenantId: string | null
    action: string | null
    performedBy: string | null
  }

  export type TenantAuditLogMaxAggregateOutputType = {
    id: bigint | null
    createdAt: Date | null
    tenantId: string | null
    action: string | null
    performedBy: string | null
  }

  export type TenantAuditLogCountAggregateOutputType = {
    id: number
    createdAt: number
    tenantId: number
    action: number
    performedBy: number
    details: number
    _all: number
  }

  export type TenantAuditLogAvgAggregateInputType = {
    id?: true
  }

  export type TenantAuditLogSumAggregateInputType = {
    id?: true
  }

  export type TenantAuditLogMinAggregateInputType = {
    id?: true
    createdAt?: true
    tenantId?: true
    action?: true
    performedBy?: true
  }

  export type TenantAuditLogMaxAggregateInputType = {
    id?: true
    createdAt?: true
    tenantId?: true
    action?: true
    performedBy?: true
  }

  export type TenantAuditLogCountAggregateInputType = {
    id?: true
    createdAt?: true
    tenantId?: true
    action?: true
    performedBy?: true
    details?: true
    _all?: true
  }

  export type TenantAuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantAuditLog to aggregate.
     */
    where?: TenantAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TenantAuditLogs to fetch.
     */
    orderBy?: TenantAuditLogOrderByWithRelationInput | TenantAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: TenantAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TenantAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TenantAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned TenantAuditLogs
     **/
    _count?: true | TenantAuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: TenantAuditLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: TenantAuditLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: TenantAuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: TenantAuditLogMaxAggregateInputType
  }

  export type GetTenantAuditLogAggregateType<T extends TenantAuditLogAggregateArgs> = {
    [P in keyof T & keyof AggregateTenantAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenantAuditLog[P]>
      : GetScalarType<T[P], AggregateTenantAuditLog[P]>
  }

  export type TenantAuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantAuditLogWhereInput
    orderBy?: TenantAuditLogOrderByWithAggregationInput | TenantAuditLogOrderByWithAggregationInput[]
    by: TenantAuditLogScalarFieldEnum[] | TenantAuditLogScalarFieldEnum
    having?: TenantAuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantAuditLogCountAggregateInputType | true
    _avg?: TenantAuditLogAvgAggregateInputType
    _sum?: TenantAuditLogSumAggregateInputType
    _min?: TenantAuditLogMinAggregateInputType
    _max?: TenantAuditLogMaxAggregateInputType
  }

  export type TenantAuditLogGroupByOutputType = {
    id: bigint
    createdAt: Date
    tenantId: string
    action: string
    performedBy: string
    details: JsonValue | null
    _count: TenantAuditLogCountAggregateOutputType | null
    _avg: TenantAuditLogAvgAggregateOutputType | null
    _sum: TenantAuditLogSumAggregateOutputType | null
    _min: TenantAuditLogMinAggregateOutputType | null
    _max: TenantAuditLogMaxAggregateOutputType | null
  }

  type GetTenantAuditLogGroupByPayload<T extends TenantAuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantAuditLogGroupByOutputType, T['by']> & {
        [P in keyof T & keyof TenantAuditLogGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], TenantAuditLogGroupByOutputType[P]>
          : GetScalarType<T[P], TenantAuditLogGroupByOutputType[P]>
      }
    >
  >

  export type TenantAuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean
        createdAt?: boolean
        tenantId?: boolean
        action?: boolean
        performedBy?: boolean
        details?: boolean
        tenant?: boolean | TenantDefaultArgs<ExtArgs>
      },
      ExtArgs['result']['tenantAuditLog']
    >

  export type TenantAuditLogSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      createdAt?: boolean
      tenantId?: boolean
      action?: boolean
      performedBy?: boolean
      details?: boolean
      tenant?: boolean | TenantDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['tenantAuditLog']
  >

  export type TenantAuditLogSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      createdAt?: boolean
      tenantId?: boolean
      action?: boolean
      performedBy?: boolean
      details?: boolean
      tenant?: boolean | TenantDefaultArgs<ExtArgs>
    },
    ExtArgs['result']['tenantAuditLog']
  >

  export type TenantAuditLogSelectScalar = {
    id?: boolean
    createdAt?: boolean
    tenantId?: boolean
    action?: boolean
    performedBy?: boolean
    details?: boolean
  }

  export type TenantAuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      'id' | 'createdAt' | 'tenantId' | 'action' | 'performedBy' | 'details',
      ExtArgs['result']['tenantAuditLog']
    >
  export type TenantAuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type TenantAuditLogIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type TenantAuditLogIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $TenantAuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'TenantAuditLog'
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<
      {
        id: bigint
        createdAt: Date
        tenantId: string
        action: string
        performedBy: string
        details: Prisma.JsonValue | null
      },
      ExtArgs['result']['tenantAuditLog']
    >
    composites: {}
  }

  type TenantAuditLogGetPayload<S extends boolean | null | undefined | TenantAuditLogDefaultArgs> = $Result.GetResult<
    Prisma.$TenantAuditLogPayload,
    S
  >

  type TenantAuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    TenantAuditLogFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: TenantAuditLogCountAggregateInputType | true
  }

  export interface TenantAuditLogDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TenantAuditLog']; meta: { name: 'TenantAuditLog' } }
    /**
     * Find zero or one TenantAuditLog that matches the filter.
     * @param {TenantAuditLogFindUniqueArgs} args - Arguments to find a TenantAuditLog
     * @example
     * // Get one TenantAuditLog
     * const tenantAuditLog = await prisma.tenantAuditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantAuditLogFindUniqueArgs>(
      args: SelectSubset<T, TenantAuditLogFindUniqueArgs<ExtArgs>>,
    ): Prisma__TenantAuditLogClient<
      $Result.GetResult<Prisma.$TenantAuditLogPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one TenantAuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantAuditLogFindUniqueOrThrowArgs} args - Arguments to find a TenantAuditLog
     * @example
     * // Get one TenantAuditLog
     * const tenantAuditLog = await prisma.tenantAuditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantAuditLogFindUniqueOrThrowArgs>(
      args: SelectSubset<T, TenantAuditLogFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__TenantAuditLogClient<
      $Result.GetResult<Prisma.$TenantAuditLogPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first TenantAuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAuditLogFindFirstArgs} args - Arguments to find a TenantAuditLog
     * @example
     * // Get one TenantAuditLog
     * const tenantAuditLog = await prisma.tenantAuditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantAuditLogFindFirstArgs>(
      args?: SelectSubset<T, TenantAuditLogFindFirstArgs<ExtArgs>>,
    ): Prisma__TenantAuditLogClient<
      $Result.GetResult<Prisma.$TenantAuditLogPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first TenantAuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAuditLogFindFirstOrThrowArgs} args - Arguments to find a TenantAuditLog
     * @example
     * // Get one TenantAuditLog
     * const tenantAuditLog = await prisma.tenantAuditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantAuditLogFindFirstOrThrowArgs>(
      args?: SelectSubset<T, TenantAuditLogFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__TenantAuditLogClient<
      $Result.GetResult<Prisma.$TenantAuditLogPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more TenantAuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TenantAuditLogs
     * const tenantAuditLogs = await prisma.tenantAuditLog.findMany()
     *
     * // Get first 10 TenantAuditLogs
     * const tenantAuditLogs = await prisma.tenantAuditLog.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const tenantAuditLogWithIdOnly = await prisma.tenantAuditLog.findMany({ select: { id: true } })
     *
     */
    findMany<T extends TenantAuditLogFindManyArgs>(
      args?: SelectSubset<T, TenantAuditLogFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantAuditLogPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>>

    /**
     * Create a TenantAuditLog.
     * @param {TenantAuditLogCreateArgs} args - Arguments to create a TenantAuditLog.
     * @example
     * // Create one TenantAuditLog
     * const TenantAuditLog = await prisma.tenantAuditLog.create({
     *   data: {
     *     // ... data to create a TenantAuditLog
     *   }
     * })
     *
     */
    create<T extends TenantAuditLogCreateArgs>(
      args: SelectSubset<T, TenantAuditLogCreateArgs<ExtArgs>>,
    ): Prisma__TenantAuditLogClient<
      $Result.GetResult<Prisma.$TenantAuditLogPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many TenantAuditLogs.
     * @param {TenantAuditLogCreateManyArgs} args - Arguments to create many TenantAuditLogs.
     * @example
     * // Create many TenantAuditLogs
     * const tenantAuditLog = await prisma.tenantAuditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends TenantAuditLogCreateManyArgs>(
      args?: SelectSubset<T, TenantAuditLogCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TenantAuditLogs and returns the data saved in the database.
     * @param {TenantAuditLogCreateManyAndReturnArgs} args - Arguments to create many TenantAuditLogs.
     * @example
     * // Create many TenantAuditLogs
     * const tenantAuditLog = await prisma.tenantAuditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many TenantAuditLogs and only return the `id`
     * const tenantAuditLogWithIdOnly = await prisma.tenantAuditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends TenantAuditLogCreateManyAndReturnArgs>(
      args?: SelectSubset<T, TenantAuditLogCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$TenantAuditLogPayload<ExtArgs>, T, 'createManyAndReturn', GlobalOmitOptions>
    >

    /**
     * Delete a TenantAuditLog.
     * @param {TenantAuditLogDeleteArgs} args - Arguments to delete one TenantAuditLog.
     * @example
     * // Delete one TenantAuditLog
     * const TenantAuditLog = await prisma.tenantAuditLog.delete({
     *   where: {
     *     // ... filter to delete one TenantAuditLog
     *   }
     * })
     *
     */
    delete<T extends TenantAuditLogDeleteArgs>(
      args: SelectSubset<T, TenantAuditLogDeleteArgs<ExtArgs>>,
    ): Prisma__TenantAuditLogClient<
      $Result.GetResult<Prisma.$TenantAuditLogPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one TenantAuditLog.
     * @param {TenantAuditLogUpdateArgs} args - Arguments to update one TenantAuditLog.
     * @example
     * // Update one TenantAuditLog
     * const tenantAuditLog = await prisma.tenantAuditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends TenantAuditLogUpdateArgs>(
      args: SelectSubset<T, TenantAuditLogUpdateArgs<ExtArgs>>,
    ): Prisma__TenantAuditLogClient<
      $Result.GetResult<Prisma.$TenantAuditLogPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more TenantAuditLogs.
     * @param {TenantAuditLogDeleteManyArgs} args - Arguments to filter TenantAuditLogs to delete.
     * @example
     * // Delete a few TenantAuditLogs
     * const { count } = await prisma.tenantAuditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends TenantAuditLogDeleteManyArgs>(
      args?: SelectSubset<T, TenantAuditLogDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TenantAuditLogs
     * const tenantAuditLog = await prisma.tenantAuditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends TenantAuditLogUpdateManyArgs>(
      args: SelectSubset<T, TenantAuditLogUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantAuditLogs and returns the data updated in the database.
     * @param {TenantAuditLogUpdateManyAndReturnArgs} args - Arguments to update many TenantAuditLogs.
     * @example
     * // Update many TenantAuditLogs
     * const tenantAuditLog = await prisma.tenantAuditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more TenantAuditLogs and only return the `id`
     * const tenantAuditLogWithIdOnly = await prisma.tenantAuditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends TenantAuditLogUpdateManyAndReturnArgs>(
      args: SelectSubset<T, TenantAuditLogUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$TenantAuditLogPayload<ExtArgs>, T, 'updateManyAndReturn', GlobalOmitOptions>
    >

    /**
     * Create or update one TenantAuditLog.
     * @param {TenantAuditLogUpsertArgs} args - Arguments to update or create a TenantAuditLog.
     * @example
     * // Update or create a TenantAuditLog
     * const tenantAuditLog = await prisma.tenantAuditLog.upsert({
     *   create: {
     *     // ... data to create a TenantAuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TenantAuditLog we want to update
     *   }
     * })
     */
    upsert<T extends TenantAuditLogUpsertArgs>(
      args: SelectSubset<T, TenantAuditLogUpsertArgs<ExtArgs>>,
    ): Prisma__TenantAuditLogClient<
      $Result.GetResult<Prisma.$TenantAuditLogPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of TenantAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAuditLogCountArgs} args - Arguments to filter TenantAuditLogs to count.
     * @example
     * // Count the number of TenantAuditLogs
     * const count = await prisma.tenantAuditLog.count({
     *   where: {
     *     // ... the filter for the TenantAuditLogs we want to count
     *   }
     * })
     **/
    count<T extends TenantAuditLogCountArgs>(
      args?: Subset<T, TenantAuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantAuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TenantAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends TenantAuditLogAggregateArgs>(
      args: Subset<T, TenantAuditLogAggregateArgs>,
    ): Prisma.PrismaPromise<GetTenantAuditLogAggregateType<T>>

    /**
     * Group by TenantAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends TenantAuditLogGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantAuditLogGroupByArgs['orderBy'] }
        : { orderBy?: TenantAuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, TenantAuditLogGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetTenantAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the TenantAuditLog model
     */
    readonly fields: TenantAuditLogFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for TenantAuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantAuditLogClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, TenantDefaultArgs<ExtArgs>>,
    ): Prisma__TenantClient<
      $Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions> | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the TenantAuditLog model
   */
  interface TenantAuditLogFieldRefs {
    readonly id: FieldRef<'TenantAuditLog', 'BigInt'>
    readonly createdAt: FieldRef<'TenantAuditLog', 'DateTime'>
    readonly tenantId: FieldRef<'TenantAuditLog', 'String'>
    readonly action: FieldRef<'TenantAuditLog', 'String'>
    readonly performedBy: FieldRef<'TenantAuditLog', 'String'>
    readonly details: FieldRef<'TenantAuditLog', 'Json'>
  }

  // Custom InputTypes
  /**
   * TenantAuditLog findUnique
   */
  export type TenantAuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAuditLog
     */
    select?: TenantAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAuditLog
     */
    omit?: TenantAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which TenantAuditLog to fetch.
     */
    where: TenantAuditLogWhereUniqueInput
  }

  /**
   * TenantAuditLog findUniqueOrThrow
   */
  export type TenantAuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the TenantAuditLog
       */
      select?: TenantAuditLogSelect<ExtArgs> | null
      /**
       * Omit specific fields from the TenantAuditLog
       */
      omit?: TenantAuditLogOmit<ExtArgs> | null
      /**
       * Choose, which related nodes to fetch as well
       */
      include?: TenantAuditLogInclude<ExtArgs> | null
      /**
       * Filter, which TenantAuditLog to fetch.
       */
      where: TenantAuditLogWhereUniqueInput
    }

  /**
   * TenantAuditLog findFirst
   */
  export type TenantAuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAuditLog
     */
    select?: TenantAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAuditLog
     */
    omit?: TenantAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which TenantAuditLog to fetch.
     */
    where?: TenantAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TenantAuditLogs to fetch.
     */
    orderBy?: TenantAuditLogOrderByWithRelationInput | TenantAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TenantAuditLogs.
     */
    cursor?: TenantAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TenantAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TenantAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TenantAuditLogs.
     */
    distinct?: TenantAuditLogScalarFieldEnum | TenantAuditLogScalarFieldEnum[]
  }

  /**
   * TenantAuditLog findFirstOrThrow
   */
  export type TenantAuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAuditLog
     */
    select?: TenantAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAuditLog
     */
    omit?: TenantAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which TenantAuditLog to fetch.
     */
    where?: TenantAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TenantAuditLogs to fetch.
     */
    orderBy?: TenantAuditLogOrderByWithRelationInput | TenantAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TenantAuditLogs.
     */
    cursor?: TenantAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TenantAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TenantAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TenantAuditLogs.
     */
    distinct?: TenantAuditLogScalarFieldEnum | TenantAuditLogScalarFieldEnum[]
  }

  /**
   * TenantAuditLog findMany
   */
  export type TenantAuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAuditLog
     */
    select?: TenantAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAuditLog
     */
    omit?: TenantAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAuditLogInclude<ExtArgs> | null
    /**
     * Filter, which TenantAuditLogs to fetch.
     */
    where?: TenantAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TenantAuditLogs to fetch.
     */
    orderBy?: TenantAuditLogOrderByWithRelationInput | TenantAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing TenantAuditLogs.
     */
    cursor?: TenantAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TenantAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TenantAuditLogs.
     */
    skip?: number
    distinct?: TenantAuditLogScalarFieldEnum | TenantAuditLogScalarFieldEnum[]
  }

  /**
   * TenantAuditLog create
   */
  export type TenantAuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAuditLog
     */
    select?: TenantAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAuditLog
     */
    omit?: TenantAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a TenantAuditLog.
     */
    data: XOR<TenantAuditLogCreateInput, TenantAuditLogUncheckedCreateInput>
  }

  /**
   * TenantAuditLog createMany
   */
  export type TenantAuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TenantAuditLogs.
     */
    data: TenantAuditLogCreateManyInput | TenantAuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TenantAuditLog createManyAndReturn
   */
  export type TenantAuditLogCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TenantAuditLog
     */
    select?: TenantAuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAuditLog
     */
    omit?: TenantAuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many TenantAuditLogs.
     */
    data: TenantAuditLogCreateManyInput | TenantAuditLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TenantAuditLog update
   */
  export type TenantAuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAuditLog
     */
    select?: TenantAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAuditLog
     */
    omit?: TenantAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a TenantAuditLog.
     */
    data: XOR<TenantAuditLogUpdateInput, TenantAuditLogUncheckedUpdateInput>
    /**
     * Choose, which TenantAuditLog to update.
     */
    where: TenantAuditLogWhereUniqueInput
  }

  /**
   * TenantAuditLog updateMany
   */
  export type TenantAuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TenantAuditLogs.
     */
    data: XOR<TenantAuditLogUpdateManyMutationInput, TenantAuditLogUncheckedUpdateManyInput>
    /**
     * Filter which TenantAuditLogs to update
     */
    where?: TenantAuditLogWhereInput
    /**
     * Limit how many TenantAuditLogs to update.
     */
    limit?: number
  }

  /**
   * TenantAuditLog updateManyAndReturn
   */
  export type TenantAuditLogUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the TenantAuditLog
     */
    select?: TenantAuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAuditLog
     */
    omit?: TenantAuditLogOmit<ExtArgs> | null
    /**
     * The data used to update TenantAuditLogs.
     */
    data: XOR<TenantAuditLogUpdateManyMutationInput, TenantAuditLogUncheckedUpdateManyInput>
    /**
     * Filter which TenantAuditLogs to update
     */
    where?: TenantAuditLogWhereInput
    /**
     * Limit how many TenantAuditLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAuditLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TenantAuditLog upsert
   */
  export type TenantAuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAuditLog
     */
    select?: TenantAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAuditLog
     */
    omit?: TenantAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the TenantAuditLog to update in case it exists.
     */
    where: TenantAuditLogWhereUniqueInput
    /**
     * In case the TenantAuditLog found by the `where` argument doesn't exist, create a new TenantAuditLog with this data.
     */
    create: XOR<TenantAuditLogCreateInput, TenantAuditLogUncheckedCreateInput>
    /**
     * In case the TenantAuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantAuditLogUpdateInput, TenantAuditLogUncheckedUpdateInput>
  }

  /**
   * TenantAuditLog delete
   */
  export type TenantAuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAuditLog
     */
    select?: TenantAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAuditLog
     */
    omit?: TenantAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAuditLogInclude<ExtArgs> | null
    /**
     * Filter which TenantAuditLog to delete.
     */
    where: TenantAuditLogWhereUniqueInput
  }

  /**
   * TenantAuditLog deleteMany
   */
  export type TenantAuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantAuditLogs to delete
     */
    where?: TenantAuditLogWhereInput
    /**
     * Limit how many TenantAuditLogs to delete.
     */
    limit?: number
  }

  /**
   * TenantAuditLog without action
   */
  export type TenantAuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantAuditLog
     */
    select?: TenantAuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantAuditLog
     */
    omit?: TenantAuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantAuditLogInclude<ExtArgs> | null
  }

  /**
   * Model SuperAdmin
   */

  export type AggregateSuperAdmin = {
    _count: SuperAdminCountAggregateOutputType | null
    _avg: SuperAdminAvgAggregateOutputType | null
    _sum: SuperAdminSumAggregateOutputType | null
    _min: SuperAdminMinAggregateOutputType | null
    _max: SuperAdminMaxAggregateOutputType | null
  }

  export type SuperAdminAvgAggregateOutputType = {
    id: number | null
  }

  export type SuperAdminSumAggregateOutputType = {
    id: bigint | null
  }

  export type SuperAdminMinAggregateOutputType = {
    id: bigint | null
    createdAt: Date | null
    name: string | null
    email: string | null
    passwordHash: string | null
    lastLoginAt: Date | null
    isActive: boolean | null
  }

  export type SuperAdminMaxAggregateOutputType = {
    id: bigint | null
    createdAt: Date | null
    name: string | null
    email: string | null
    passwordHash: string | null
    lastLoginAt: Date | null
    isActive: boolean | null
  }

  export type SuperAdminCountAggregateOutputType = {
    id: number
    createdAt: number
    name: number
    email: number
    passwordHash: number
    lastLoginAt: number
    isActive: number
    _all: number
  }

  export type SuperAdminAvgAggregateInputType = {
    id?: true
  }

  export type SuperAdminSumAggregateInputType = {
    id?: true
  }

  export type SuperAdminMinAggregateInputType = {
    id?: true
    createdAt?: true
    name?: true
    email?: true
    passwordHash?: true
    lastLoginAt?: true
    isActive?: true
  }

  export type SuperAdminMaxAggregateInputType = {
    id?: true
    createdAt?: true
    name?: true
    email?: true
    passwordHash?: true
    lastLoginAt?: true
    isActive?: true
  }

  export type SuperAdminCountAggregateInputType = {
    id?: true
    createdAt?: true
    name?: true
    email?: true
    passwordHash?: true
    lastLoginAt?: true
    isActive?: true
    _all?: true
  }

  export type SuperAdminAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SuperAdmin to aggregate.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned SuperAdmins
     **/
    _count?: true | SuperAdminCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: SuperAdminAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: SuperAdminSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: SuperAdminMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: SuperAdminMaxAggregateInputType
  }

  export type GetSuperAdminAggregateType<T extends SuperAdminAggregateArgs> = {
    [P in keyof T & keyof AggregateSuperAdmin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSuperAdmin[P]>
      : GetScalarType<T[P], AggregateSuperAdmin[P]>
  }

  export type SuperAdminGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SuperAdminWhereInput
    orderBy?: SuperAdminOrderByWithAggregationInput | SuperAdminOrderByWithAggregationInput[]
    by: SuperAdminScalarFieldEnum[] | SuperAdminScalarFieldEnum
    having?: SuperAdminScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SuperAdminCountAggregateInputType | true
    _avg?: SuperAdminAvgAggregateInputType
    _sum?: SuperAdminSumAggregateInputType
    _min?: SuperAdminMinAggregateInputType
    _max?: SuperAdminMaxAggregateInputType
  }

  export type SuperAdminGroupByOutputType = {
    id: bigint
    createdAt: Date
    name: string
    email: string
    passwordHash: string
    lastLoginAt: Date | null
    isActive: boolean
    _count: SuperAdminCountAggregateOutputType | null
    _avg: SuperAdminAvgAggregateOutputType | null
    _sum: SuperAdminSumAggregateOutputType | null
    _min: SuperAdminMinAggregateOutputType | null
    _max: SuperAdminMaxAggregateOutputType | null
  }

  type GetSuperAdminGroupByPayload<T extends SuperAdminGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SuperAdminGroupByOutputType, T['by']> & {
        [P in keyof T & keyof SuperAdminGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], SuperAdminGroupByOutputType[P]>
          : GetScalarType<T[P], SuperAdminGroupByOutputType[P]>
      }
    >
  >

  export type SuperAdminSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean
        createdAt?: boolean
        name?: boolean
        email?: boolean
        passwordHash?: boolean
        lastLoginAt?: boolean
        isActive?: boolean
      },
      ExtArgs['result']['superAdmin']
    >

  export type SuperAdminSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean
        createdAt?: boolean
        name?: boolean
        email?: boolean
        passwordHash?: boolean
        lastLoginAt?: boolean
        isActive?: boolean
      },
      ExtArgs['result']['superAdmin']
    >

  export type SuperAdminSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean
        createdAt?: boolean
        name?: boolean
        email?: boolean
        passwordHash?: boolean
        lastLoginAt?: boolean
        isActive?: boolean
      },
      ExtArgs['result']['superAdmin']
    >

  export type SuperAdminSelectScalar = {
    id?: boolean
    createdAt?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    lastLoginAt?: boolean
    isActive?: boolean
  }

  export type SuperAdminOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<
    'id' | 'createdAt' | 'name' | 'email' | 'passwordHash' | 'lastLoginAt' | 'isActive',
    ExtArgs['result']['superAdmin']
  >

  export type $SuperAdminPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'SuperAdmin'
    objects: {}
    scalars: $Extensions.GetPayloadResult<
      {
        id: bigint
        createdAt: Date
        name: string
        email: string
        passwordHash: string
        lastLoginAt: Date | null
        isActive: boolean
      },
      ExtArgs['result']['superAdmin']
    >
    composites: {}
  }

  type SuperAdminGetPayload<S extends boolean | null | undefined | SuperAdminDefaultArgs> = $Result.GetResult<
    Prisma.$SuperAdminPayload,
    S
  >

  type SuperAdminCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    SuperAdminFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: SuperAdminCountAggregateInputType | true
  }

  export interface SuperAdminDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SuperAdmin']; meta: { name: 'SuperAdmin' } }
    /**
     * Find zero or one SuperAdmin that matches the filter.
     * @param {SuperAdminFindUniqueArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SuperAdminFindUniqueArgs>(
      args: SelectSubset<T, SuperAdminFindUniqueArgs<ExtArgs>>,
    ): Prisma__SuperAdminClient<
      $Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one SuperAdmin that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SuperAdminFindUniqueOrThrowArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SuperAdminFindUniqueOrThrowArgs>(
      args: SelectSubset<T, SuperAdminFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__SuperAdminClient<
      $Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first SuperAdmin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminFindFirstArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SuperAdminFindFirstArgs>(
      args?: SelectSubset<T, SuperAdminFindFirstArgs<ExtArgs>>,
    ): Prisma__SuperAdminClient<
      $Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first SuperAdmin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminFindFirstOrThrowArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SuperAdminFindFirstOrThrowArgs>(
      args?: SelectSubset<T, SuperAdminFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__SuperAdminClient<
      $Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more SuperAdmins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SuperAdmins
     * const superAdmins = await prisma.superAdmin.findMany()
     *
     * // Get first 10 SuperAdmins
     * const superAdmins = await prisma.superAdmin.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const superAdminWithIdOnly = await prisma.superAdmin.findMany({ select: { id: true } })
     *
     */
    findMany<T extends SuperAdminFindManyArgs>(
      args?: SelectSubset<T, SuperAdminFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>>

    /**
     * Create a SuperAdmin.
     * @param {SuperAdminCreateArgs} args - Arguments to create a SuperAdmin.
     * @example
     * // Create one SuperAdmin
     * const SuperAdmin = await prisma.superAdmin.create({
     *   data: {
     *     // ... data to create a SuperAdmin
     *   }
     * })
     *
     */
    create<T extends SuperAdminCreateArgs>(
      args: SelectSubset<T, SuperAdminCreateArgs<ExtArgs>>,
    ): Prisma__SuperAdminClient<
      $Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many SuperAdmins.
     * @param {SuperAdminCreateManyArgs} args - Arguments to create many SuperAdmins.
     * @example
     * // Create many SuperAdmins
     * const superAdmin = await prisma.superAdmin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends SuperAdminCreateManyArgs>(
      args?: SelectSubset<T, SuperAdminCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SuperAdmins and returns the data saved in the database.
     * @param {SuperAdminCreateManyAndReturnArgs} args - Arguments to create many SuperAdmins.
     * @example
     * // Create many SuperAdmins
     * const superAdmin = await prisma.superAdmin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many SuperAdmins and only return the `id`
     * const superAdminWithIdOnly = await prisma.superAdmin.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends SuperAdminCreateManyAndReturnArgs>(
      args?: SelectSubset<T, SuperAdminCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, 'createManyAndReturn', GlobalOmitOptions>
    >

    /**
     * Delete a SuperAdmin.
     * @param {SuperAdminDeleteArgs} args - Arguments to delete one SuperAdmin.
     * @example
     * // Delete one SuperAdmin
     * const SuperAdmin = await prisma.superAdmin.delete({
     *   where: {
     *     // ... filter to delete one SuperAdmin
     *   }
     * })
     *
     */
    delete<T extends SuperAdminDeleteArgs>(
      args: SelectSubset<T, SuperAdminDeleteArgs<ExtArgs>>,
    ): Prisma__SuperAdminClient<
      $Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one SuperAdmin.
     * @param {SuperAdminUpdateArgs} args - Arguments to update one SuperAdmin.
     * @example
     * // Update one SuperAdmin
     * const superAdmin = await prisma.superAdmin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends SuperAdminUpdateArgs>(
      args: SelectSubset<T, SuperAdminUpdateArgs<ExtArgs>>,
    ): Prisma__SuperAdminClient<
      $Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more SuperAdmins.
     * @param {SuperAdminDeleteManyArgs} args - Arguments to filter SuperAdmins to delete.
     * @example
     * // Delete a few SuperAdmins
     * const { count } = await prisma.superAdmin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends SuperAdminDeleteManyArgs>(
      args?: SelectSubset<T, SuperAdminDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SuperAdmins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SuperAdmins
     * const superAdmin = await prisma.superAdmin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends SuperAdminUpdateManyArgs>(
      args: SelectSubset<T, SuperAdminUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SuperAdmins and returns the data updated in the database.
     * @param {SuperAdminUpdateManyAndReturnArgs} args - Arguments to update many SuperAdmins.
     * @example
     * // Update many SuperAdmins
     * const superAdmin = await prisma.superAdmin.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more SuperAdmins and only return the `id`
     * const superAdminWithIdOnly = await prisma.superAdmin.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends SuperAdminUpdateManyAndReturnArgs>(
      args: SelectSubset<T, SuperAdminUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, 'updateManyAndReturn', GlobalOmitOptions>
    >

    /**
     * Create or update one SuperAdmin.
     * @param {SuperAdminUpsertArgs} args - Arguments to update or create a SuperAdmin.
     * @example
     * // Update or create a SuperAdmin
     * const superAdmin = await prisma.superAdmin.upsert({
     *   create: {
     *     // ... data to create a SuperAdmin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SuperAdmin we want to update
     *   }
     * })
     */
    upsert<T extends SuperAdminUpsertArgs>(
      args: SelectSubset<T, SuperAdminUpsertArgs<ExtArgs>>,
    ): Prisma__SuperAdminClient<
      $Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of SuperAdmins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminCountArgs} args - Arguments to filter SuperAdmins to count.
     * @example
     * // Count the number of SuperAdmins
     * const count = await prisma.superAdmin.count({
     *   where: {
     *     // ... the filter for the SuperAdmins we want to count
     *   }
     * })
     **/
    count<T extends SuperAdminCountArgs>(
      args?: Subset<T, SuperAdminCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SuperAdminCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SuperAdmin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends SuperAdminAggregateArgs>(
      args: Subset<T, SuperAdminAggregateArgs>,
    ): Prisma.PrismaPromise<GetSuperAdminAggregateType<T>>

    /**
     * Group by SuperAdmin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends SuperAdminGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SuperAdminGroupByArgs['orderBy'] }
        : { orderBy?: SuperAdminGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, SuperAdminGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetSuperAdminGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the SuperAdmin model
     */
    readonly fields: SuperAdminFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for SuperAdmin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SuperAdminClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the SuperAdmin model
   */
  interface SuperAdminFieldRefs {
    readonly id: FieldRef<'SuperAdmin', 'BigInt'>
    readonly createdAt: FieldRef<'SuperAdmin', 'DateTime'>
    readonly name: FieldRef<'SuperAdmin', 'String'>
    readonly email: FieldRef<'SuperAdmin', 'String'>
    readonly passwordHash: FieldRef<'SuperAdmin', 'String'>
    readonly lastLoginAt: FieldRef<'SuperAdmin', 'DateTime'>
    readonly isActive: FieldRef<'SuperAdmin', 'Boolean'>
  }

  // Custom InputTypes
  /**
   * SuperAdmin findUnique
   */
  export type SuperAdminFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin findUniqueOrThrow
   */
  export type SuperAdminFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin findFirst
   */
  export type SuperAdminFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SuperAdmins.
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SuperAdmins.
     */
    distinct?: SuperAdminScalarFieldEnum | SuperAdminScalarFieldEnum[]
  }

  /**
   * SuperAdmin findFirstOrThrow
   */
  export type SuperAdminFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for SuperAdmins.
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of SuperAdmins.
     */
    distinct?: SuperAdminScalarFieldEnum | SuperAdminScalarFieldEnum[]
  }

  /**
   * SuperAdmin findMany
   */
  export type SuperAdminFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * Filter, which SuperAdmins to fetch.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing SuperAdmins.
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    distinct?: SuperAdminScalarFieldEnum | SuperAdminScalarFieldEnum[]
  }

  /**
   * SuperAdmin create
   */
  export type SuperAdminCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * The data needed to create a SuperAdmin.
     */
    data: XOR<SuperAdminCreateInput, SuperAdminUncheckedCreateInput>
  }

  /**
   * SuperAdmin createMany
   */
  export type SuperAdminCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SuperAdmins.
     */
    data: SuperAdminCreateManyInput | SuperAdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SuperAdmin createManyAndReturn
   */
  export type SuperAdminCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * The data used to create many SuperAdmins.
     */
    data: SuperAdminCreateManyInput | SuperAdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SuperAdmin update
   */
  export type SuperAdminUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * The data needed to update a SuperAdmin.
     */
    data: XOR<SuperAdminUpdateInput, SuperAdminUncheckedUpdateInput>
    /**
     * Choose, which SuperAdmin to update.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin updateMany
   */
  export type SuperAdminUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SuperAdmins.
     */
    data: XOR<SuperAdminUpdateManyMutationInput, SuperAdminUncheckedUpdateManyInput>
    /**
     * Filter which SuperAdmins to update
     */
    where?: SuperAdminWhereInput
    /**
     * Limit how many SuperAdmins to update.
     */
    limit?: number
  }

  /**
   * SuperAdmin updateManyAndReturn
   */
  export type SuperAdminUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * The data used to update SuperAdmins.
     */
    data: XOR<SuperAdminUpdateManyMutationInput, SuperAdminUncheckedUpdateManyInput>
    /**
     * Filter which SuperAdmins to update
     */
    where?: SuperAdminWhereInput
    /**
     * Limit how many SuperAdmins to update.
     */
    limit?: number
  }

  /**
   * SuperAdmin upsert
   */
  export type SuperAdminUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * The filter to search for the SuperAdmin to update in case it exists.
     */
    where: SuperAdminWhereUniqueInput
    /**
     * In case the SuperAdmin found by the `where` argument doesn't exist, create a new SuperAdmin with this data.
     */
    create: XOR<SuperAdminCreateInput, SuperAdminUncheckedCreateInput>
    /**
     * In case the SuperAdmin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SuperAdminUpdateInput, SuperAdminUncheckedUpdateInput>
  }

  /**
   * SuperAdmin delete
   */
  export type SuperAdminDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * Filter which SuperAdmin to delete.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin deleteMany
   */
  export type SuperAdminDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SuperAdmins to delete
     */
    where?: SuperAdminWhereInput
    /**
     * Limit how many SuperAdmins to delete.
     */
    limit?: number
  }

  /**
   * SuperAdmin without action
   */
  export type SuperAdminDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
  }

  /**
   * Model OtpSession
   */

  export type AggregateOtpSession = {
    _count: OtpSessionCountAggregateOutputType | null
    _avg: OtpSessionAvgAggregateOutputType | null
    _sum: OtpSessionSumAggregateOutputType | null
    _min: OtpSessionMinAggregateOutputType | null
    _max: OtpSessionMaxAggregateOutputType | null
  }

  export type OtpSessionAvgAggregateOutputType = {
    id: number | null
    attempts: number | null
  }

  export type OtpSessionSumAggregateOutputType = {
    id: bigint | null
    attempts: number | null
  }

  export type OtpSessionMinAggregateOutputType = {
    id: bigint | null
    sessionId: string | null
    purpose: $Enums.OtpPurpose | null
    phone: string | null
    destinationMasked: string | null
    expiresAt: Date | null
    attempts: number | null
    otpCode: string | null
    verifiedAt: Date | null
    createdAt: Date | null
  }

  export type OtpSessionMaxAggregateOutputType = {
    id: bigint | null
    sessionId: string | null
    purpose: $Enums.OtpPurpose | null
    phone: string | null
    destinationMasked: string | null
    expiresAt: Date | null
    attempts: number | null
    otpCode: string | null
    verifiedAt: Date | null
    createdAt: Date | null
  }

  export type OtpSessionCountAggregateOutputType = {
    id: number
    sessionId: number
    purpose: number
    phone: number
    destinationMasked: number
    expiresAt: number
    attempts: number
    otpCode: number
    verifiedAt: number
    createdAt: number
    _all: number
  }

  export type OtpSessionAvgAggregateInputType = {
    id?: true
    attempts?: true
  }

  export type OtpSessionSumAggregateInputType = {
    id?: true
    attempts?: true
  }

  export type OtpSessionMinAggregateInputType = {
    id?: true
    sessionId?: true
    purpose?: true
    phone?: true
    destinationMasked?: true
    expiresAt?: true
    attempts?: true
    otpCode?: true
    verifiedAt?: true
    createdAt?: true
  }

  export type OtpSessionMaxAggregateInputType = {
    id?: true
    sessionId?: true
    purpose?: true
    phone?: true
    destinationMasked?: true
    expiresAt?: true
    attempts?: true
    otpCode?: true
    verifiedAt?: true
    createdAt?: true
  }

  export type OtpSessionCountAggregateInputType = {
    id?: true
    sessionId?: true
    purpose?: true
    phone?: true
    destinationMasked?: true
    expiresAt?: true
    attempts?: true
    otpCode?: true
    verifiedAt?: true
    createdAt?: true
    _all?: true
  }

  export type OtpSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OtpSession to aggregate.
     */
    where?: OtpSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OtpSessions to fetch.
     */
    orderBy?: OtpSessionOrderByWithRelationInput | OtpSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: OtpSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OtpSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OtpSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned OtpSessions
     **/
    _count?: true | OtpSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: OtpSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: OtpSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: OtpSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: OtpSessionMaxAggregateInputType
  }

  export type GetOtpSessionAggregateType<T extends OtpSessionAggregateArgs> = {
    [P in keyof T & keyof AggregateOtpSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOtpSession[P]>
      : GetScalarType<T[P], AggregateOtpSession[P]>
  }

  export type OtpSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OtpSessionWhereInput
    orderBy?: OtpSessionOrderByWithAggregationInput | OtpSessionOrderByWithAggregationInput[]
    by: OtpSessionScalarFieldEnum[] | OtpSessionScalarFieldEnum
    having?: OtpSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OtpSessionCountAggregateInputType | true
    _avg?: OtpSessionAvgAggregateInputType
    _sum?: OtpSessionSumAggregateInputType
    _min?: OtpSessionMinAggregateInputType
    _max?: OtpSessionMaxAggregateInputType
  }

  export type OtpSessionGroupByOutputType = {
    id: bigint
    sessionId: string
    purpose: $Enums.OtpPurpose
    phone: string
    destinationMasked: string
    expiresAt: Date
    attempts: number
    otpCode: string | null
    verifiedAt: Date | null
    createdAt: Date
    _count: OtpSessionCountAggregateOutputType | null
    _avg: OtpSessionAvgAggregateOutputType | null
    _sum: OtpSessionSumAggregateOutputType | null
    _min: OtpSessionMinAggregateOutputType | null
    _max: OtpSessionMaxAggregateOutputType | null
  }

  type GetOtpSessionGroupByPayload<T extends OtpSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OtpSessionGroupByOutputType, T['by']> & {
        [P in keyof T & keyof OtpSessionGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], OtpSessionGroupByOutputType[P]>
          : GetScalarType<T[P], OtpSessionGroupByOutputType[P]>
      }
    >
  >

  export type OtpSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean
        sessionId?: boolean
        purpose?: boolean
        phone?: boolean
        destinationMasked?: boolean
        expiresAt?: boolean
        attempts?: boolean
        otpCode?: boolean
        verifiedAt?: boolean
        createdAt?: boolean
      },
      ExtArgs['result']['otpSession']
    >

  export type OtpSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean
        sessionId?: boolean
        purpose?: boolean
        phone?: boolean
        destinationMasked?: boolean
        expiresAt?: boolean
        attempts?: boolean
        otpCode?: boolean
        verifiedAt?: boolean
        createdAt?: boolean
      },
      ExtArgs['result']['otpSession']
    >

  export type OtpSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean
        sessionId?: boolean
        purpose?: boolean
        phone?: boolean
        destinationMasked?: boolean
        expiresAt?: boolean
        attempts?: boolean
        otpCode?: boolean
        verifiedAt?: boolean
        createdAt?: boolean
      },
      ExtArgs['result']['otpSession']
    >

  export type OtpSessionSelectScalar = {
    id?: boolean
    sessionId?: boolean
    purpose?: boolean
    phone?: boolean
    destinationMasked?: boolean
    expiresAt?: boolean
    attempts?: boolean
    otpCode?: boolean
    verifiedAt?: boolean
    createdAt?: boolean
  }

  export type OtpSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<
    | 'id'
    | 'sessionId'
    | 'purpose'
    | 'phone'
    | 'destinationMasked'
    | 'expiresAt'
    | 'attempts'
    | 'otpCode'
    | 'verifiedAt'
    | 'createdAt',
    ExtArgs['result']['otpSession']
  >

  export type $OtpSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'OtpSession'
    objects: {}
    scalars: $Extensions.GetPayloadResult<
      {
        id: bigint
        sessionId: string
        purpose: $Enums.OtpPurpose
        phone: string
        destinationMasked: string
        expiresAt: Date
        attempts: number
        otpCode: string | null
        verifiedAt: Date | null
        createdAt: Date
      },
      ExtArgs['result']['otpSession']
    >
    composites: {}
  }

  type OtpSessionGetPayload<S extends boolean | null | undefined | OtpSessionDefaultArgs> = $Result.GetResult<
    Prisma.$OtpSessionPayload,
    S
  >

  type OtpSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    OtpSessionFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: OtpSessionCountAggregateInputType | true
  }

  export interface OtpSessionDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OtpSession']; meta: { name: 'OtpSession' } }
    /**
     * Find zero or one OtpSession that matches the filter.
     * @param {OtpSessionFindUniqueArgs} args - Arguments to find a OtpSession
     * @example
     * // Get one OtpSession
     * const otpSession = await prisma.otpSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OtpSessionFindUniqueArgs>(
      args: SelectSubset<T, OtpSessionFindUniqueArgs<ExtArgs>>,
    ): Prisma__OtpSessionClient<
      $Result.GetResult<Prisma.$OtpSessionPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one OtpSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OtpSessionFindUniqueOrThrowArgs} args - Arguments to find a OtpSession
     * @example
     * // Get one OtpSession
     * const otpSession = await prisma.otpSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OtpSessionFindUniqueOrThrowArgs>(
      args: SelectSubset<T, OtpSessionFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__OtpSessionClient<
      $Result.GetResult<Prisma.$OtpSessionPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first OtpSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpSessionFindFirstArgs} args - Arguments to find a OtpSession
     * @example
     * // Get one OtpSession
     * const otpSession = await prisma.otpSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OtpSessionFindFirstArgs>(
      args?: SelectSubset<T, OtpSessionFindFirstArgs<ExtArgs>>,
    ): Prisma__OtpSessionClient<
      $Result.GetResult<Prisma.$OtpSessionPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first OtpSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpSessionFindFirstOrThrowArgs} args - Arguments to find a OtpSession
     * @example
     * // Get one OtpSession
     * const otpSession = await prisma.otpSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OtpSessionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, OtpSessionFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__OtpSessionClient<
      $Result.GetResult<Prisma.$OtpSessionPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more OtpSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OtpSessions
     * const otpSessions = await prisma.otpSession.findMany()
     *
     * // Get first 10 OtpSessions
     * const otpSessions = await prisma.otpSession.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const otpSessionWithIdOnly = await prisma.otpSession.findMany({ select: { id: true } })
     *
     */
    findMany<T extends OtpSessionFindManyArgs>(
      args?: SelectSubset<T, OtpSessionFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OtpSessionPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>>

    /**
     * Create a OtpSession.
     * @param {OtpSessionCreateArgs} args - Arguments to create a OtpSession.
     * @example
     * // Create one OtpSession
     * const OtpSession = await prisma.otpSession.create({
     *   data: {
     *     // ... data to create a OtpSession
     *   }
     * })
     *
     */
    create<T extends OtpSessionCreateArgs>(
      args: SelectSubset<T, OtpSessionCreateArgs<ExtArgs>>,
    ): Prisma__OtpSessionClient<
      $Result.GetResult<Prisma.$OtpSessionPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many OtpSessions.
     * @param {OtpSessionCreateManyArgs} args - Arguments to create many OtpSessions.
     * @example
     * // Create many OtpSessions
     * const otpSession = await prisma.otpSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends OtpSessionCreateManyArgs>(
      args?: SelectSubset<T, OtpSessionCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many OtpSessions and returns the data saved in the database.
     * @param {OtpSessionCreateManyAndReturnArgs} args - Arguments to create many OtpSessions.
     * @example
     * // Create many OtpSessions
     * const otpSession = await prisma.otpSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many OtpSessions and only return the `id`
     * const otpSessionWithIdOnly = await prisma.otpSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends OtpSessionCreateManyAndReturnArgs>(
      args?: SelectSubset<T, OtpSessionCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$OtpSessionPayload<ExtArgs>, T, 'createManyAndReturn', GlobalOmitOptions>
    >

    /**
     * Delete a OtpSession.
     * @param {OtpSessionDeleteArgs} args - Arguments to delete one OtpSession.
     * @example
     * // Delete one OtpSession
     * const OtpSession = await prisma.otpSession.delete({
     *   where: {
     *     // ... filter to delete one OtpSession
     *   }
     * })
     *
     */
    delete<T extends OtpSessionDeleteArgs>(
      args: SelectSubset<T, OtpSessionDeleteArgs<ExtArgs>>,
    ): Prisma__OtpSessionClient<
      $Result.GetResult<Prisma.$OtpSessionPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one OtpSession.
     * @param {OtpSessionUpdateArgs} args - Arguments to update one OtpSession.
     * @example
     * // Update one OtpSession
     * const otpSession = await prisma.otpSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends OtpSessionUpdateArgs>(
      args: SelectSubset<T, OtpSessionUpdateArgs<ExtArgs>>,
    ): Prisma__OtpSessionClient<
      $Result.GetResult<Prisma.$OtpSessionPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more OtpSessions.
     * @param {OtpSessionDeleteManyArgs} args - Arguments to filter OtpSessions to delete.
     * @example
     * // Delete a few OtpSessions
     * const { count } = await prisma.otpSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends OtpSessionDeleteManyArgs>(
      args?: SelectSubset<T, OtpSessionDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OtpSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OtpSessions
     * const otpSession = await prisma.otpSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends OtpSessionUpdateManyArgs>(
      args: SelectSubset<T, OtpSessionUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OtpSessions and returns the data updated in the database.
     * @param {OtpSessionUpdateManyAndReturnArgs} args - Arguments to update many OtpSessions.
     * @example
     * // Update many OtpSessions
     * const otpSession = await prisma.otpSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more OtpSessions and only return the `id`
     * const otpSessionWithIdOnly = await prisma.otpSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends OtpSessionUpdateManyAndReturnArgs>(
      args: SelectSubset<T, OtpSessionUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$OtpSessionPayload<ExtArgs>, T, 'updateManyAndReturn', GlobalOmitOptions>
    >

    /**
     * Create or update one OtpSession.
     * @param {OtpSessionUpsertArgs} args - Arguments to update or create a OtpSession.
     * @example
     * // Update or create a OtpSession
     * const otpSession = await prisma.otpSession.upsert({
     *   create: {
     *     // ... data to create a OtpSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OtpSession we want to update
     *   }
     * })
     */
    upsert<T extends OtpSessionUpsertArgs>(
      args: SelectSubset<T, OtpSessionUpsertArgs<ExtArgs>>,
    ): Prisma__OtpSessionClient<
      $Result.GetResult<Prisma.$OtpSessionPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of OtpSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpSessionCountArgs} args - Arguments to filter OtpSessions to count.
     * @example
     * // Count the number of OtpSessions
     * const count = await prisma.otpSession.count({
     *   where: {
     *     // ... the filter for the OtpSessions we want to count
     *   }
     * })
     **/
    count<T extends OtpSessionCountArgs>(
      args?: Subset<T, OtpSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OtpSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OtpSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends OtpSessionAggregateArgs>(
      args: Subset<T, OtpSessionAggregateArgs>,
    ): Prisma.PrismaPromise<GetOtpSessionAggregateType<T>>

    /**
     * Group by OtpSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OtpSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends OtpSessionGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OtpSessionGroupByArgs['orderBy'] }
        : { orderBy?: OtpSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, OtpSessionGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetOtpSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the OtpSession model
     */
    readonly fields: OtpSessionFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for OtpSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OtpSessionClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the OtpSession model
   */
  interface OtpSessionFieldRefs {
    readonly id: FieldRef<'OtpSession', 'BigInt'>
    readonly sessionId: FieldRef<'OtpSession', 'String'>
    readonly purpose: FieldRef<'OtpSession', 'OtpPurpose'>
    readonly phone: FieldRef<'OtpSession', 'String'>
    readonly destinationMasked: FieldRef<'OtpSession', 'String'>
    readonly expiresAt: FieldRef<'OtpSession', 'DateTime'>
    readonly attempts: FieldRef<'OtpSession', 'Int'>
    readonly otpCode: FieldRef<'OtpSession', 'String'>
    readonly verifiedAt: FieldRef<'OtpSession', 'DateTime'>
    readonly createdAt: FieldRef<'OtpSession', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * OtpSession findUnique
   */
  export type OtpSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpSession
     */
    select?: OtpSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpSession
     */
    omit?: OtpSessionOmit<ExtArgs> | null
    /**
     * Filter, which OtpSession to fetch.
     */
    where: OtpSessionWhereUniqueInput
  }

  /**
   * OtpSession findUniqueOrThrow
   */
  export type OtpSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpSession
     */
    select?: OtpSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpSession
     */
    omit?: OtpSessionOmit<ExtArgs> | null
    /**
     * Filter, which OtpSession to fetch.
     */
    where: OtpSessionWhereUniqueInput
  }

  /**
   * OtpSession findFirst
   */
  export type OtpSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpSession
     */
    select?: OtpSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpSession
     */
    omit?: OtpSessionOmit<ExtArgs> | null
    /**
     * Filter, which OtpSession to fetch.
     */
    where?: OtpSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OtpSessions to fetch.
     */
    orderBy?: OtpSessionOrderByWithRelationInput | OtpSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for OtpSessions.
     */
    cursor?: OtpSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OtpSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OtpSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OtpSessions.
     */
    distinct?: OtpSessionScalarFieldEnum | OtpSessionScalarFieldEnum[]
  }

  /**
   * OtpSession findFirstOrThrow
   */
  export type OtpSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpSession
     */
    select?: OtpSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpSession
     */
    omit?: OtpSessionOmit<ExtArgs> | null
    /**
     * Filter, which OtpSession to fetch.
     */
    where?: OtpSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OtpSessions to fetch.
     */
    orderBy?: OtpSessionOrderByWithRelationInput | OtpSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for OtpSessions.
     */
    cursor?: OtpSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OtpSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OtpSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of OtpSessions.
     */
    distinct?: OtpSessionScalarFieldEnum | OtpSessionScalarFieldEnum[]
  }

  /**
   * OtpSession findMany
   */
  export type OtpSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpSession
     */
    select?: OtpSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpSession
     */
    omit?: OtpSessionOmit<ExtArgs> | null
    /**
     * Filter, which OtpSessions to fetch.
     */
    where?: OtpSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of OtpSessions to fetch.
     */
    orderBy?: OtpSessionOrderByWithRelationInput | OtpSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing OtpSessions.
     */
    cursor?: OtpSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` OtpSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` OtpSessions.
     */
    skip?: number
    distinct?: OtpSessionScalarFieldEnum | OtpSessionScalarFieldEnum[]
  }

  /**
   * OtpSession create
   */
  export type OtpSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpSession
     */
    select?: OtpSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpSession
     */
    omit?: OtpSessionOmit<ExtArgs> | null
    /**
     * The data needed to create a OtpSession.
     */
    data: XOR<OtpSessionCreateInput, OtpSessionUncheckedCreateInput>
  }

  /**
   * OtpSession createMany
   */
  export type OtpSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OtpSessions.
     */
    data: OtpSessionCreateManyInput | OtpSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OtpSession createManyAndReturn
   */
  export type OtpSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpSession
     */
    select?: OtpSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OtpSession
     */
    omit?: OtpSessionOmit<ExtArgs> | null
    /**
     * The data used to create many OtpSessions.
     */
    data: OtpSessionCreateManyInput | OtpSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OtpSession update
   */
  export type OtpSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpSession
     */
    select?: OtpSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpSession
     */
    omit?: OtpSessionOmit<ExtArgs> | null
    /**
     * The data needed to update a OtpSession.
     */
    data: XOR<OtpSessionUpdateInput, OtpSessionUncheckedUpdateInput>
    /**
     * Choose, which OtpSession to update.
     */
    where: OtpSessionWhereUniqueInput
  }

  /**
   * OtpSession updateMany
   */
  export type OtpSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OtpSessions.
     */
    data: XOR<OtpSessionUpdateManyMutationInput, OtpSessionUncheckedUpdateManyInput>
    /**
     * Filter which OtpSessions to update
     */
    where?: OtpSessionWhereInput
    /**
     * Limit how many OtpSessions to update.
     */
    limit?: number
  }

  /**
   * OtpSession updateManyAndReturn
   */
  export type OtpSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpSession
     */
    select?: OtpSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the OtpSession
     */
    omit?: OtpSessionOmit<ExtArgs> | null
    /**
     * The data used to update OtpSessions.
     */
    data: XOR<OtpSessionUpdateManyMutationInput, OtpSessionUncheckedUpdateManyInput>
    /**
     * Filter which OtpSessions to update
     */
    where?: OtpSessionWhereInput
    /**
     * Limit how many OtpSessions to update.
     */
    limit?: number
  }

  /**
   * OtpSession upsert
   */
  export type OtpSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpSession
     */
    select?: OtpSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpSession
     */
    omit?: OtpSessionOmit<ExtArgs> | null
    /**
     * The filter to search for the OtpSession to update in case it exists.
     */
    where: OtpSessionWhereUniqueInput
    /**
     * In case the OtpSession found by the `where` argument doesn't exist, create a new OtpSession with this data.
     */
    create: XOR<OtpSessionCreateInput, OtpSessionUncheckedCreateInput>
    /**
     * In case the OtpSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OtpSessionUpdateInput, OtpSessionUncheckedUpdateInput>
  }

  /**
   * OtpSession delete
   */
  export type OtpSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpSession
     */
    select?: OtpSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpSession
     */
    omit?: OtpSessionOmit<ExtArgs> | null
    /**
     * Filter which OtpSession to delete.
     */
    where: OtpSessionWhereUniqueInput
  }

  /**
   * OtpSession deleteMany
   */
  export type OtpSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OtpSessions to delete
     */
    where?: OtpSessionWhereInput
    /**
     * Limit how many OtpSessions to delete.
     */
    limit?: number
  }

  /**
   * OtpSession without action
   */
  export type OtpSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OtpSession
     */
    select?: OtpSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OtpSession
     */
    omit?: OtpSessionOmit<ExtArgs> | null
  }

  /**
   * Model RefreshToken
   */

  export type AggregateRefreshToken = {
    _count: RefreshTokenCountAggregateOutputType | null
    _avg: RefreshTokenAvgAggregateOutputType | null
    _sum: RefreshTokenSumAggregateOutputType | null
    _min: RefreshTokenMinAggregateOutputType | null
    _max: RefreshTokenMaxAggregateOutputType | null
  }

  export type RefreshTokenAvgAggregateOutputType = {
    id: number | null
  }

  export type RefreshTokenSumAggregateOutputType = {
    id: bigint | null
  }

  export type RefreshTokenMinAggregateOutputType = {
    id: bigint | null
    tokenHash: string | null
    userSub: string | null
    name: string | null
    role: string | null
    email: string | null
    expiresAt: Date | null
    revokedAt: Date | null
    createdAt: Date | null
  }

  export type RefreshTokenMaxAggregateOutputType = {
    id: bigint | null
    tokenHash: string | null
    userSub: string | null
    name: string | null
    role: string | null
    email: string | null
    expiresAt: Date | null
    revokedAt: Date | null
    createdAt: Date | null
  }

  export type RefreshTokenCountAggregateOutputType = {
    id: number
    tokenHash: number
    userSub: number
    name: number
    role: number
    email: number
    expiresAt: number
    revokedAt: number
    createdAt: number
    _all: number
  }

  export type RefreshTokenAvgAggregateInputType = {
    id?: true
  }

  export type RefreshTokenSumAggregateInputType = {
    id?: true
  }

  export type RefreshTokenMinAggregateInputType = {
    id?: true
    tokenHash?: true
    userSub?: true
    name?: true
    role?: true
    email?: true
    expiresAt?: true
    revokedAt?: true
    createdAt?: true
  }

  export type RefreshTokenMaxAggregateInputType = {
    id?: true
    tokenHash?: true
    userSub?: true
    name?: true
    role?: true
    email?: true
    expiresAt?: true
    revokedAt?: true
    createdAt?: true
  }

  export type RefreshTokenCountAggregateInputType = {
    id?: true
    tokenHash?: true
    userSub?: true
    name?: true
    role?: true
    email?: true
    expiresAt?: true
    revokedAt?: true
    createdAt?: true
    _all?: true
  }

  export type RefreshTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RefreshToken to aggregate.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned RefreshTokens
     **/
    _count?: true | RefreshTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: RefreshTokenAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: RefreshTokenSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: RefreshTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: RefreshTokenMaxAggregateInputType
  }

  export type GetRefreshTokenAggregateType<T extends RefreshTokenAggregateArgs> = {
    [P in keyof T & keyof AggregateRefreshToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRefreshToken[P]>
      : GetScalarType<T[P], AggregateRefreshToken[P]>
  }

  export type RefreshTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RefreshTokenWhereInput
    orderBy?: RefreshTokenOrderByWithAggregationInput | RefreshTokenOrderByWithAggregationInput[]
    by: RefreshTokenScalarFieldEnum[] | RefreshTokenScalarFieldEnum
    having?: RefreshTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RefreshTokenCountAggregateInputType | true
    _avg?: RefreshTokenAvgAggregateInputType
    _sum?: RefreshTokenSumAggregateInputType
    _min?: RefreshTokenMinAggregateInputType
    _max?: RefreshTokenMaxAggregateInputType
  }

  export type RefreshTokenGroupByOutputType = {
    id: bigint
    tokenHash: string
    userSub: string
    name: string
    role: string
    email: string
    expiresAt: Date
    revokedAt: Date | null
    createdAt: Date
    _count: RefreshTokenCountAggregateOutputType | null
    _avg: RefreshTokenAvgAggregateOutputType | null
    _sum: RefreshTokenSumAggregateOutputType | null
    _min: RefreshTokenMinAggregateOutputType | null
    _max: RefreshTokenMaxAggregateOutputType | null
  }

  type GetRefreshTokenGroupByPayload<T extends RefreshTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RefreshTokenGroupByOutputType, T['by']> & {
        [P in keyof T & keyof RefreshTokenGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], RefreshTokenGroupByOutputType[P]>
          : GetScalarType<T[P], RefreshTokenGroupByOutputType[P]>
      }
    >
  >

  export type RefreshTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean
        tokenHash?: boolean
        userSub?: boolean
        name?: boolean
        role?: boolean
        email?: boolean
        expiresAt?: boolean
        revokedAt?: boolean
        createdAt?: boolean
      },
      ExtArgs['result']['refreshToken']
    >

  export type RefreshTokenSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      tokenHash?: boolean
      userSub?: boolean
      name?: boolean
      role?: boolean
      email?: boolean
      expiresAt?: boolean
      revokedAt?: boolean
      createdAt?: boolean
    },
    ExtArgs['result']['refreshToken']
  >

  export type RefreshTokenSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      tokenHash?: boolean
      userSub?: boolean
      name?: boolean
      role?: boolean
      email?: boolean
      expiresAt?: boolean
      revokedAt?: boolean
      createdAt?: boolean
    },
    ExtArgs['result']['refreshToken']
  >

  export type RefreshTokenSelectScalar = {
    id?: boolean
    tokenHash?: boolean
    userSub?: boolean
    name?: boolean
    role?: boolean
    email?: boolean
    expiresAt?: boolean
    revokedAt?: boolean
    createdAt?: boolean
  }

  export type RefreshTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      'id' | 'tokenHash' | 'userSub' | 'name' | 'role' | 'email' | 'expiresAt' | 'revokedAt' | 'createdAt',
      ExtArgs['result']['refreshToken']
    >

  export type $RefreshTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'RefreshToken'
    objects: {}
    scalars: $Extensions.GetPayloadResult<
      {
        id: bigint
        tokenHash: string
        userSub: string
        name: string
        role: string
        email: string
        expiresAt: Date
        revokedAt: Date | null
        createdAt: Date
      },
      ExtArgs['result']['refreshToken']
    >
    composites: {}
  }

  type RefreshTokenGetPayload<S extends boolean | null | undefined | RefreshTokenDefaultArgs> = $Result.GetResult<
    Prisma.$RefreshTokenPayload,
    S
  >

  type RefreshTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    RefreshTokenFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: RefreshTokenCountAggregateInputType | true
  }

  export interface RefreshTokenDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RefreshToken']; meta: { name: 'RefreshToken' } }
    /**
     * Find zero or one RefreshToken that matches the filter.
     * @param {RefreshTokenFindUniqueArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RefreshTokenFindUniqueArgs>(
      args: SelectSubset<T, RefreshTokenFindUniqueArgs<ExtArgs>>,
    ): Prisma__RefreshTokenClient<
      $Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one RefreshToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RefreshTokenFindUniqueOrThrowArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RefreshTokenFindUniqueOrThrowArgs>(
      args: SelectSubset<T, RefreshTokenFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__RefreshTokenClient<
      $Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first RefreshToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindFirstArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RefreshTokenFindFirstArgs>(
      args?: SelectSubset<T, RefreshTokenFindFirstArgs<ExtArgs>>,
    ): Prisma__RefreshTokenClient<
      $Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first RefreshToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindFirstOrThrowArgs} args - Arguments to find a RefreshToken
     * @example
     * // Get one RefreshToken
     * const refreshToken = await prisma.refreshToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RefreshTokenFindFirstOrThrowArgs>(
      args?: SelectSubset<T, RefreshTokenFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__RefreshTokenClient<
      $Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more RefreshTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RefreshTokens
     * const refreshTokens = await prisma.refreshToken.findMany()
     *
     * // Get first 10 RefreshTokens
     * const refreshTokens = await prisma.refreshToken.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.findMany({ select: { id: true } })
     *
     */
    findMany<T extends RefreshTokenFindManyArgs>(
      args?: SelectSubset<T, RefreshTokenFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>>

    /**
     * Create a RefreshToken.
     * @param {RefreshTokenCreateArgs} args - Arguments to create a RefreshToken.
     * @example
     * // Create one RefreshToken
     * const RefreshToken = await prisma.refreshToken.create({
     *   data: {
     *     // ... data to create a RefreshToken
     *   }
     * })
     *
     */
    create<T extends RefreshTokenCreateArgs>(
      args: SelectSubset<T, RefreshTokenCreateArgs<ExtArgs>>,
    ): Prisma__RefreshTokenClient<
      $Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many RefreshTokens.
     * @param {RefreshTokenCreateManyArgs} args - Arguments to create many RefreshTokens.
     * @example
     * // Create many RefreshTokens
     * const refreshToken = await prisma.refreshToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends RefreshTokenCreateManyArgs>(
      args?: SelectSubset<T, RefreshTokenCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RefreshTokens and returns the data saved in the database.
     * @param {RefreshTokenCreateManyAndReturnArgs} args - Arguments to create many RefreshTokens.
     * @example
     * // Create many RefreshTokens
     * const refreshToken = await prisma.refreshToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many RefreshTokens and only return the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends RefreshTokenCreateManyAndReturnArgs>(
      args?: SelectSubset<T, RefreshTokenCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, 'createManyAndReturn', GlobalOmitOptions>
    >

    /**
     * Delete a RefreshToken.
     * @param {RefreshTokenDeleteArgs} args - Arguments to delete one RefreshToken.
     * @example
     * // Delete one RefreshToken
     * const RefreshToken = await prisma.refreshToken.delete({
     *   where: {
     *     // ... filter to delete one RefreshToken
     *   }
     * })
     *
     */
    delete<T extends RefreshTokenDeleteArgs>(
      args: SelectSubset<T, RefreshTokenDeleteArgs<ExtArgs>>,
    ): Prisma__RefreshTokenClient<
      $Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one RefreshToken.
     * @param {RefreshTokenUpdateArgs} args - Arguments to update one RefreshToken.
     * @example
     * // Update one RefreshToken
     * const refreshToken = await prisma.refreshToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends RefreshTokenUpdateArgs>(
      args: SelectSubset<T, RefreshTokenUpdateArgs<ExtArgs>>,
    ): Prisma__RefreshTokenClient<
      $Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more RefreshTokens.
     * @param {RefreshTokenDeleteManyArgs} args - Arguments to filter RefreshTokens to delete.
     * @example
     * // Delete a few RefreshTokens
     * const { count } = await prisma.refreshToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends RefreshTokenDeleteManyArgs>(
      args?: SelectSubset<T, RefreshTokenDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RefreshTokens
     * const refreshToken = await prisma.refreshToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends RefreshTokenUpdateManyArgs>(
      args: SelectSubset<T, RefreshTokenUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RefreshTokens and returns the data updated in the database.
     * @param {RefreshTokenUpdateManyAndReturnArgs} args - Arguments to update many RefreshTokens.
     * @example
     * // Update many RefreshTokens
     * const refreshToken = await prisma.refreshToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more RefreshTokens and only return the `id`
     * const refreshTokenWithIdOnly = await prisma.refreshToken.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends RefreshTokenUpdateManyAndReturnArgs>(
      args: SelectSubset<T, RefreshTokenUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, 'updateManyAndReturn', GlobalOmitOptions>
    >

    /**
     * Create or update one RefreshToken.
     * @param {RefreshTokenUpsertArgs} args - Arguments to update or create a RefreshToken.
     * @example
     * // Update or create a RefreshToken
     * const refreshToken = await prisma.refreshToken.upsert({
     *   create: {
     *     // ... data to create a RefreshToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RefreshToken we want to update
     *   }
     * })
     */
    upsert<T extends RefreshTokenUpsertArgs>(
      args: SelectSubset<T, RefreshTokenUpsertArgs<ExtArgs>>,
    ): Prisma__RefreshTokenClient<
      $Result.GetResult<Prisma.$RefreshTokenPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of RefreshTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenCountArgs} args - Arguments to filter RefreshTokens to count.
     * @example
     * // Count the number of RefreshTokens
     * const count = await prisma.refreshToken.count({
     *   where: {
     *     // ... the filter for the RefreshTokens we want to count
     *   }
     * })
     **/
    count<T extends RefreshTokenCountArgs>(
      args?: Subset<T, RefreshTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RefreshTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RefreshToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends RefreshTokenAggregateArgs>(
      args: Subset<T, RefreshTokenAggregateArgs>,
    ): Prisma.PrismaPromise<GetRefreshTokenAggregateType<T>>

    /**
     * Group by RefreshToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RefreshTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends RefreshTokenGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RefreshTokenGroupByArgs['orderBy'] }
        : { orderBy?: RefreshTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, RefreshTokenGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetRefreshTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the RefreshToken model
     */
    readonly fields: RefreshTokenFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for RefreshToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RefreshTokenClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the RefreshToken model
   */
  interface RefreshTokenFieldRefs {
    readonly id: FieldRef<'RefreshToken', 'BigInt'>
    readonly tokenHash: FieldRef<'RefreshToken', 'String'>
    readonly userSub: FieldRef<'RefreshToken', 'String'>
    readonly name: FieldRef<'RefreshToken', 'String'>
    readonly role: FieldRef<'RefreshToken', 'String'>
    readonly email: FieldRef<'RefreshToken', 'String'>
    readonly expiresAt: FieldRef<'RefreshToken', 'DateTime'>
    readonly revokedAt: FieldRef<'RefreshToken', 'DateTime'>
    readonly createdAt: FieldRef<'RefreshToken', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * RefreshToken findUnique
   */
  export type RefreshTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken findUniqueOrThrow
   */
  export type RefreshTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken findFirst
   */
  export type RefreshTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RefreshTokens.
     */
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken findFirstOrThrow
   */
  export type RefreshTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Filter, which RefreshToken to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of RefreshTokens.
     */
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken findMany
   */
  export type RefreshTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Filter, which RefreshTokens to fetch.
     */
    where?: RefreshTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of RefreshTokens to fetch.
     */
    orderBy?: RefreshTokenOrderByWithRelationInput | RefreshTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing RefreshTokens.
     */
    cursor?: RefreshTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` RefreshTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` RefreshTokens.
     */
    skip?: number
    distinct?: RefreshTokenScalarFieldEnum | RefreshTokenScalarFieldEnum[]
  }

  /**
   * RefreshToken create
   */
  export type RefreshTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * The data needed to create a RefreshToken.
     */
    data: XOR<RefreshTokenCreateInput, RefreshTokenUncheckedCreateInput>
  }

  /**
   * RefreshToken createMany
   */
  export type RefreshTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RefreshTokens.
     */
    data: RefreshTokenCreateManyInput | RefreshTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RefreshToken createManyAndReturn
   */
  export type RefreshTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the RefreshToken
       */
      select?: RefreshTokenSelectCreateManyAndReturn<ExtArgs> | null
      /**
       * Omit specific fields from the RefreshToken
       */
      omit?: RefreshTokenOmit<ExtArgs> | null
      /**
       * The data used to create many RefreshTokens.
       */
      data: RefreshTokenCreateManyInput | RefreshTokenCreateManyInput[]
      skipDuplicates?: boolean
    }

  /**
   * RefreshToken update
   */
  export type RefreshTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * The data needed to update a RefreshToken.
     */
    data: XOR<RefreshTokenUpdateInput, RefreshTokenUncheckedUpdateInput>
    /**
     * Choose, which RefreshToken to update.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken updateMany
   */
  export type RefreshTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RefreshTokens.
     */
    data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyInput>
    /**
     * Filter which RefreshTokens to update
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to update.
     */
    limit?: number
  }

  /**
   * RefreshToken updateManyAndReturn
   */
  export type RefreshTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the RefreshToken
       */
      select?: RefreshTokenSelectUpdateManyAndReturn<ExtArgs> | null
      /**
       * Omit specific fields from the RefreshToken
       */
      omit?: RefreshTokenOmit<ExtArgs> | null
      /**
       * The data used to update RefreshTokens.
       */
      data: XOR<RefreshTokenUpdateManyMutationInput, RefreshTokenUncheckedUpdateManyInput>
      /**
       * Filter which RefreshTokens to update
       */
      where?: RefreshTokenWhereInput
      /**
       * Limit how many RefreshTokens to update.
       */
      limit?: number
    }

  /**
   * RefreshToken upsert
   */
  export type RefreshTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * The filter to search for the RefreshToken to update in case it exists.
     */
    where: RefreshTokenWhereUniqueInput
    /**
     * In case the RefreshToken found by the `where` argument doesn't exist, create a new RefreshToken with this data.
     */
    create: XOR<RefreshTokenCreateInput, RefreshTokenUncheckedCreateInput>
    /**
     * In case the RefreshToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RefreshTokenUpdateInput, RefreshTokenUncheckedUpdateInput>
  }

  /**
   * RefreshToken delete
   */
  export type RefreshTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
    /**
     * Filter which RefreshToken to delete.
     */
    where: RefreshTokenWhereUniqueInput
  }

  /**
   * RefreshToken deleteMany
   */
  export type RefreshTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RefreshTokens to delete
     */
    where?: RefreshTokenWhereInput
    /**
     * Limit how many RefreshTokens to delete.
     */
    limit?: number
  }

  /**
   * RefreshToken without action
   */
  export type RefreshTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RefreshToken
     */
    select?: RefreshTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RefreshToken
     */
    omit?: RefreshTokenOmit<ExtArgs> | null
  }

  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted'
    ReadCommitted: 'ReadCommitted'
    RepeatableRead: 'RepeatableRead'
    Serializable: 'Serializable'
  }

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]

  export const TenantScalarFieldEnum: {
    id: 'id'
    createdAt: 'createdAt'
    updatedAt: 'updatedAt'
    name: 'name'
    slug: 'slug'
    type: 'type'
    board: 'board'
    logoUrl: 'logoUrl'
    city: 'city'
    state: 'state'
    country: 'country'
    address: 'address'
    pincode: 'pincode'
    phone: 'phone'
    dbName: 'dbName'
    dbHost: 'dbHost'
    dbPort: 'dbPort'
    plan: 'plan'
    status: 'status'
    trialEndsAt: 'trialEndsAt'
    subscriptionStart: 'subscriptionStart'
    subscriptionEnd: 'subscriptionEnd'
    monthlyFeeInr: 'monthlyFeeInr'
    adminName: 'adminName'
    adminEmail: 'adminEmail'
    adminPhone: 'adminPhone'
    totalStudents: 'totalStudents'
    totalStaff: 'totalStaff'
    institutionCode: 'institutionCode'
  }

  export type TenantScalarFieldEnum = (typeof TenantScalarFieldEnum)[keyof typeof TenantScalarFieldEnum]

  export const TenantAuditLogScalarFieldEnum: {
    id: 'id'
    createdAt: 'createdAt'
    tenantId: 'tenantId'
    action: 'action'
    performedBy: 'performedBy'
    details: 'details'
  }

  export type TenantAuditLogScalarFieldEnum =
    (typeof TenantAuditLogScalarFieldEnum)[keyof typeof TenantAuditLogScalarFieldEnum]

  export const SuperAdminScalarFieldEnum: {
    id: 'id'
    createdAt: 'createdAt'
    name: 'name'
    email: 'email'
    passwordHash: 'passwordHash'
    lastLoginAt: 'lastLoginAt'
    isActive: 'isActive'
  }

  export type SuperAdminScalarFieldEnum = (typeof SuperAdminScalarFieldEnum)[keyof typeof SuperAdminScalarFieldEnum]

  export const OtpSessionScalarFieldEnum: {
    id: 'id'
    sessionId: 'sessionId'
    purpose: 'purpose'
    phone: 'phone'
    destinationMasked: 'destinationMasked'
    expiresAt: 'expiresAt'
    attempts: 'attempts'
    otpCode: 'otpCode'
    verifiedAt: 'verifiedAt'
    createdAt: 'createdAt'
  }

  export type OtpSessionScalarFieldEnum = (typeof OtpSessionScalarFieldEnum)[keyof typeof OtpSessionScalarFieldEnum]

  export const RefreshTokenScalarFieldEnum: {
    id: 'id'
    tokenHash: 'tokenHash'
    userSub: 'userSub'
    name: 'name'
    role: 'role'
    email: 'email'
    expiresAt: 'expiresAt'
    revokedAt: 'revokedAt'
    createdAt: 'createdAt'
  }

  export type RefreshTokenScalarFieldEnum =
    (typeof RefreshTokenScalarFieldEnum)[keyof typeof RefreshTokenScalarFieldEnum]

  export const SortOrder: {
    asc: 'asc'
    desc: 'desc'
  }

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]

  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull
    JsonNull: typeof JsonNull
  }

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]

  export const QueryMode: {
    default: 'default'
    insensitive: 'insensitive'
  }

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]

  export const NullsOrder: {
    first: 'first'
    last: 'last'
  }

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]

  export const JsonNullValueFilter: {
    DbNull: typeof DbNull
    JsonNull: typeof JsonNull
    AnyNull: typeof AnyNull
  }

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]

  /**
   * Field references
   */

  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>

  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>

  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>

  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>

  /**
   * Reference to a field of type 'TenantType'
   */
  export type EnumTenantTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TenantType'>

  /**
   * Reference to a field of type 'TenantType[]'
   */
  export type ListEnumTenantTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TenantType[]'>

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>

  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>

  /**
   * Reference to a field of type 'SubscriptionPlan'
   */
  export type EnumSubscriptionPlanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionPlan'>

  /**
   * Reference to a field of type 'SubscriptionPlan[]'
   */
  export type ListEnumSubscriptionPlanFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'SubscriptionPlan[]'
  >

  /**
   * Reference to a field of type 'TenantStatus'
   */
  export type EnumTenantStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TenantStatus'>

  /**
   * Reference to a field of type 'TenantStatus[]'
   */
  export type ListEnumTenantStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TenantStatus[]'>

  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>

  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>

  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>

  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>

  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>

  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>

  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>

  /**
   * Reference to a field of type 'OtpPurpose'
   */
  export type EnumOtpPurposeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OtpPurpose'>

  /**
   * Reference to a field of type 'OtpPurpose[]'
   */
  export type ListEnumOtpPurposeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OtpPurpose[]'>

  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>

  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>

  /**
   * Deep Input Types
   */

  export type TenantWhereInput = {
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    id?: StringFilter<'Tenant'> | string
    createdAt?: DateTimeFilter<'Tenant'> | Date | string
    updatedAt?: DateTimeFilter<'Tenant'> | Date | string
    name?: StringFilter<'Tenant'> | string
    slug?: StringFilter<'Tenant'> | string
    type?: EnumTenantTypeFilter<'Tenant'> | $Enums.TenantType
    board?: StringNullableFilter<'Tenant'> | string | null
    logoUrl?: StringNullableFilter<'Tenant'> | string | null
    city?: StringFilter<'Tenant'> | string
    state?: StringFilter<'Tenant'> | string
    country?: StringFilter<'Tenant'> | string
    address?: StringNullableFilter<'Tenant'> | string | null
    pincode?: StringNullableFilter<'Tenant'> | string | null
    phone?: StringNullableFilter<'Tenant'> | string | null
    dbName?: StringFilter<'Tenant'> | string
    dbHost?: StringFilter<'Tenant'> | string
    dbPort?: IntFilter<'Tenant'> | number
    plan?: EnumSubscriptionPlanFilter<'Tenant'> | $Enums.SubscriptionPlan
    status?: EnumTenantStatusFilter<'Tenant'> | $Enums.TenantStatus
    trialEndsAt?: DateTimeNullableFilter<'Tenant'> | Date | string | null
    subscriptionStart?: DateTimeNullableFilter<'Tenant'> | Date | string | null
    subscriptionEnd?: DateTimeNullableFilter<'Tenant'> | Date | string | null
    monthlyFeeInr?: DecimalNullableFilter<'Tenant'> | Decimal | DecimalJsLike | number | string | null
    adminName?: StringFilter<'Tenant'> | string
    adminEmail?: StringFilter<'Tenant'> | string
    adminPhone?: StringNullableFilter<'Tenant'> | string | null
    totalStudents?: IntFilter<'Tenant'> | number
    totalStaff?: IntFilter<'Tenant'> | number
    institutionCode?: StringFilter<'Tenant'> | string
    auditLogs?: TenantAuditLogListRelationFilter
  }

  export type TenantOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    type?: SortOrder
    board?: SortOrderInput | SortOrder
    logoUrl?: SortOrderInput | SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    address?: SortOrderInput | SortOrder
    pincode?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    dbName?: SortOrder
    dbHost?: SortOrder
    dbPort?: SortOrder
    plan?: SortOrder
    status?: SortOrder
    trialEndsAt?: SortOrderInput | SortOrder
    subscriptionStart?: SortOrderInput | SortOrder
    subscriptionEnd?: SortOrderInput | SortOrder
    monthlyFeeInr?: SortOrderInput | SortOrder
    adminName?: SortOrder
    adminEmail?: SortOrder
    adminPhone?: SortOrderInput | SortOrder
    totalStudents?: SortOrder
    totalStaff?: SortOrder
    institutionCode?: SortOrder
    auditLogs?: TenantAuditLogOrderByRelationAggregateInput
  }

  export type TenantWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      slug?: string
      dbName?: string
      AND?: TenantWhereInput | TenantWhereInput[]
      OR?: TenantWhereInput[]
      NOT?: TenantWhereInput | TenantWhereInput[]
      createdAt?: DateTimeFilter<'Tenant'> | Date | string
      updatedAt?: DateTimeFilter<'Tenant'> | Date | string
      name?: StringFilter<'Tenant'> | string
      type?: EnumTenantTypeFilter<'Tenant'> | $Enums.TenantType
      board?: StringNullableFilter<'Tenant'> | string | null
      logoUrl?: StringNullableFilter<'Tenant'> | string | null
      city?: StringFilter<'Tenant'> | string
      state?: StringFilter<'Tenant'> | string
      country?: StringFilter<'Tenant'> | string
      address?: StringNullableFilter<'Tenant'> | string | null
      pincode?: StringNullableFilter<'Tenant'> | string | null
      phone?: StringNullableFilter<'Tenant'> | string | null
      dbHost?: StringFilter<'Tenant'> | string
      dbPort?: IntFilter<'Tenant'> | number
      plan?: EnumSubscriptionPlanFilter<'Tenant'> | $Enums.SubscriptionPlan
      status?: EnumTenantStatusFilter<'Tenant'> | $Enums.TenantStatus
      trialEndsAt?: DateTimeNullableFilter<'Tenant'> | Date | string | null
      subscriptionStart?: DateTimeNullableFilter<'Tenant'> | Date | string | null
      subscriptionEnd?: DateTimeNullableFilter<'Tenant'> | Date | string | null
      monthlyFeeInr?: DecimalNullableFilter<'Tenant'> | Decimal | DecimalJsLike | number | string | null
      adminName?: StringFilter<'Tenant'> | string
      adminEmail?: StringFilter<'Tenant'> | string
      adminPhone?: StringNullableFilter<'Tenant'> | string | null
      totalStudents?: IntFilter<'Tenant'> | number
      totalStaff?: IntFilter<'Tenant'> | number
      institutionCode?: StringFilter<'Tenant'> | string
      auditLogs?: TenantAuditLogListRelationFilter
    },
    'id' | 'slug' | 'dbName'
  >

  export type TenantOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    type?: SortOrder
    board?: SortOrderInput | SortOrder
    logoUrl?: SortOrderInput | SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    address?: SortOrderInput | SortOrder
    pincode?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    dbName?: SortOrder
    dbHost?: SortOrder
    dbPort?: SortOrder
    plan?: SortOrder
    status?: SortOrder
    trialEndsAt?: SortOrderInput | SortOrder
    subscriptionStart?: SortOrderInput | SortOrder
    subscriptionEnd?: SortOrderInput | SortOrder
    monthlyFeeInr?: SortOrderInput | SortOrder
    adminName?: SortOrder
    adminEmail?: SortOrder
    adminPhone?: SortOrderInput | SortOrder
    totalStudents?: SortOrder
    totalStaff?: SortOrder
    institutionCode?: SortOrder
    _count?: TenantCountOrderByAggregateInput
    _avg?: TenantAvgOrderByAggregateInput
    _max?: TenantMaxOrderByAggregateInput
    _min?: TenantMinOrderByAggregateInput
    _sum?: TenantSumOrderByAggregateInput
  }

  export type TenantScalarWhereWithAggregatesInput = {
    AND?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    OR?: TenantScalarWhereWithAggregatesInput[]
    NOT?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'Tenant'> | string
    createdAt?: DateTimeWithAggregatesFilter<'Tenant'> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<'Tenant'> | Date | string
    name?: StringWithAggregatesFilter<'Tenant'> | string
    slug?: StringWithAggregatesFilter<'Tenant'> | string
    type?: EnumTenantTypeWithAggregatesFilter<'Tenant'> | $Enums.TenantType
    board?: StringNullableWithAggregatesFilter<'Tenant'> | string | null
    logoUrl?: StringNullableWithAggregatesFilter<'Tenant'> | string | null
    city?: StringWithAggregatesFilter<'Tenant'> | string
    state?: StringWithAggregatesFilter<'Tenant'> | string
    country?: StringWithAggregatesFilter<'Tenant'> | string
    address?: StringNullableWithAggregatesFilter<'Tenant'> | string | null
    pincode?: StringNullableWithAggregatesFilter<'Tenant'> | string | null
    phone?: StringNullableWithAggregatesFilter<'Tenant'> | string | null
    dbName?: StringWithAggregatesFilter<'Tenant'> | string
    dbHost?: StringWithAggregatesFilter<'Tenant'> | string
    dbPort?: IntWithAggregatesFilter<'Tenant'> | number
    plan?: EnumSubscriptionPlanWithAggregatesFilter<'Tenant'> | $Enums.SubscriptionPlan
    status?: EnumTenantStatusWithAggregatesFilter<'Tenant'> | $Enums.TenantStatus
    trialEndsAt?: DateTimeNullableWithAggregatesFilter<'Tenant'> | Date | string | null
    subscriptionStart?: DateTimeNullableWithAggregatesFilter<'Tenant'> | Date | string | null
    subscriptionEnd?: DateTimeNullableWithAggregatesFilter<'Tenant'> | Date | string | null
    monthlyFeeInr?: DecimalNullableWithAggregatesFilter<'Tenant'> | Decimal | DecimalJsLike | number | string | null
    adminName?: StringWithAggregatesFilter<'Tenant'> | string
    adminEmail?: StringWithAggregatesFilter<'Tenant'> | string
    adminPhone?: StringNullableWithAggregatesFilter<'Tenant'> | string | null
    totalStudents?: IntWithAggregatesFilter<'Tenant'> | number
    totalStaff?: IntWithAggregatesFilter<'Tenant'> | number
    institutionCode?: StringWithAggregatesFilter<'Tenant'> | string
  }

  export type TenantAuditLogWhereInput = {
    AND?: TenantAuditLogWhereInput | TenantAuditLogWhereInput[]
    OR?: TenantAuditLogWhereInput[]
    NOT?: TenantAuditLogWhereInput | TenantAuditLogWhereInput[]
    id?: BigIntFilter<'TenantAuditLog'> | bigint | number
    createdAt?: DateTimeFilter<'TenantAuditLog'> | Date | string
    tenantId?: StringFilter<'TenantAuditLog'> | string
    action?: StringFilter<'TenantAuditLog'> | string
    performedBy?: StringFilter<'TenantAuditLog'> | string
    details?: JsonNullableFilter<'TenantAuditLog'>
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type TenantAuditLogOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    tenantId?: SortOrder
    action?: SortOrder
    performedBy?: SortOrder
    details?: SortOrderInput | SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type TenantAuditLogWhereUniqueInput = Prisma.AtLeast<
    {
      id?: bigint | number
      AND?: TenantAuditLogWhereInput | TenantAuditLogWhereInput[]
      OR?: TenantAuditLogWhereInput[]
      NOT?: TenantAuditLogWhereInput | TenantAuditLogWhereInput[]
      createdAt?: DateTimeFilter<'TenantAuditLog'> | Date | string
      tenantId?: StringFilter<'TenantAuditLog'> | string
      action?: StringFilter<'TenantAuditLog'> | string
      performedBy?: StringFilter<'TenantAuditLog'> | string
      details?: JsonNullableFilter<'TenantAuditLog'>
      tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
    },
    'id'
  >

  export type TenantAuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    tenantId?: SortOrder
    action?: SortOrder
    performedBy?: SortOrder
    details?: SortOrderInput | SortOrder
    _count?: TenantAuditLogCountOrderByAggregateInput
    _avg?: TenantAuditLogAvgOrderByAggregateInput
    _max?: TenantAuditLogMaxOrderByAggregateInput
    _min?: TenantAuditLogMinOrderByAggregateInput
    _sum?: TenantAuditLogSumOrderByAggregateInput
  }

  export type TenantAuditLogScalarWhereWithAggregatesInput = {
    AND?: TenantAuditLogScalarWhereWithAggregatesInput | TenantAuditLogScalarWhereWithAggregatesInput[]
    OR?: TenantAuditLogScalarWhereWithAggregatesInput[]
    NOT?: TenantAuditLogScalarWhereWithAggregatesInput | TenantAuditLogScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<'TenantAuditLog'> | bigint | number
    createdAt?: DateTimeWithAggregatesFilter<'TenantAuditLog'> | Date | string
    tenantId?: StringWithAggregatesFilter<'TenantAuditLog'> | string
    action?: StringWithAggregatesFilter<'TenantAuditLog'> | string
    performedBy?: StringWithAggregatesFilter<'TenantAuditLog'> | string
    details?: JsonNullableWithAggregatesFilter<'TenantAuditLog'>
  }

  export type SuperAdminWhereInput = {
    AND?: SuperAdminWhereInput | SuperAdminWhereInput[]
    OR?: SuperAdminWhereInput[]
    NOT?: SuperAdminWhereInput | SuperAdminWhereInput[]
    id?: BigIntFilter<'SuperAdmin'> | bigint | number
    createdAt?: DateTimeFilter<'SuperAdmin'> | Date | string
    name?: StringFilter<'SuperAdmin'> | string
    email?: StringFilter<'SuperAdmin'> | string
    passwordHash?: StringFilter<'SuperAdmin'> | string
    lastLoginAt?: DateTimeNullableFilter<'SuperAdmin'> | Date | string | null
    isActive?: BoolFilter<'SuperAdmin'> | boolean
  }

  export type SuperAdminOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    isActive?: SortOrder
  }

  export type SuperAdminWhereUniqueInput = Prisma.AtLeast<
    {
      id?: bigint | number
      email?: string
      AND?: SuperAdminWhereInput | SuperAdminWhereInput[]
      OR?: SuperAdminWhereInput[]
      NOT?: SuperAdminWhereInput | SuperAdminWhereInput[]
      createdAt?: DateTimeFilter<'SuperAdmin'> | Date | string
      name?: StringFilter<'SuperAdmin'> | string
      passwordHash?: StringFilter<'SuperAdmin'> | string
      lastLoginAt?: DateTimeNullableFilter<'SuperAdmin'> | Date | string | null
      isActive?: BoolFilter<'SuperAdmin'> | boolean
    },
    'id' | 'email'
  >

  export type SuperAdminOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    isActive?: SortOrder
    _count?: SuperAdminCountOrderByAggregateInput
    _avg?: SuperAdminAvgOrderByAggregateInput
    _max?: SuperAdminMaxOrderByAggregateInput
    _min?: SuperAdminMinOrderByAggregateInput
    _sum?: SuperAdminSumOrderByAggregateInput
  }

  export type SuperAdminScalarWhereWithAggregatesInput = {
    AND?: SuperAdminScalarWhereWithAggregatesInput | SuperAdminScalarWhereWithAggregatesInput[]
    OR?: SuperAdminScalarWhereWithAggregatesInput[]
    NOT?: SuperAdminScalarWhereWithAggregatesInput | SuperAdminScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<'SuperAdmin'> | bigint | number
    createdAt?: DateTimeWithAggregatesFilter<'SuperAdmin'> | Date | string
    name?: StringWithAggregatesFilter<'SuperAdmin'> | string
    email?: StringWithAggregatesFilter<'SuperAdmin'> | string
    passwordHash?: StringWithAggregatesFilter<'SuperAdmin'> | string
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<'SuperAdmin'> | Date | string | null
    isActive?: BoolWithAggregatesFilter<'SuperAdmin'> | boolean
  }

  export type OtpSessionWhereInput = {
    AND?: OtpSessionWhereInput | OtpSessionWhereInput[]
    OR?: OtpSessionWhereInput[]
    NOT?: OtpSessionWhereInput | OtpSessionWhereInput[]
    id?: BigIntFilter<'OtpSession'> | bigint | number
    sessionId?: StringFilter<'OtpSession'> | string
    purpose?: EnumOtpPurposeFilter<'OtpSession'> | $Enums.OtpPurpose
    phone?: StringFilter<'OtpSession'> | string
    destinationMasked?: StringFilter<'OtpSession'> | string
    expiresAt?: DateTimeFilter<'OtpSession'> | Date | string
    attempts?: IntFilter<'OtpSession'> | number
    otpCode?: StringNullableFilter<'OtpSession'> | string | null
    verifiedAt?: DateTimeNullableFilter<'OtpSession'> | Date | string | null
    createdAt?: DateTimeFilter<'OtpSession'> | Date | string
  }

  export type OtpSessionOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    purpose?: SortOrder
    phone?: SortOrder
    destinationMasked?: SortOrder
    expiresAt?: SortOrder
    attempts?: SortOrder
    otpCode?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type OtpSessionWhereUniqueInput = Prisma.AtLeast<
    {
      id?: bigint | number
      sessionId?: string
      AND?: OtpSessionWhereInput | OtpSessionWhereInput[]
      OR?: OtpSessionWhereInput[]
      NOT?: OtpSessionWhereInput | OtpSessionWhereInput[]
      purpose?: EnumOtpPurposeFilter<'OtpSession'> | $Enums.OtpPurpose
      phone?: StringFilter<'OtpSession'> | string
      destinationMasked?: StringFilter<'OtpSession'> | string
      expiresAt?: DateTimeFilter<'OtpSession'> | Date | string
      attempts?: IntFilter<'OtpSession'> | number
      otpCode?: StringNullableFilter<'OtpSession'> | string | null
      verifiedAt?: DateTimeNullableFilter<'OtpSession'> | Date | string | null
      createdAt?: DateTimeFilter<'OtpSession'> | Date | string
    },
    'id' | 'sessionId'
  >

  export type OtpSessionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    purpose?: SortOrder
    phone?: SortOrder
    destinationMasked?: SortOrder
    expiresAt?: SortOrder
    attempts?: SortOrder
    otpCode?: SortOrderInput | SortOrder
    verifiedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: OtpSessionCountOrderByAggregateInput
    _avg?: OtpSessionAvgOrderByAggregateInput
    _max?: OtpSessionMaxOrderByAggregateInput
    _min?: OtpSessionMinOrderByAggregateInput
    _sum?: OtpSessionSumOrderByAggregateInput
  }

  export type OtpSessionScalarWhereWithAggregatesInput = {
    AND?: OtpSessionScalarWhereWithAggregatesInput | OtpSessionScalarWhereWithAggregatesInput[]
    OR?: OtpSessionScalarWhereWithAggregatesInput[]
    NOT?: OtpSessionScalarWhereWithAggregatesInput | OtpSessionScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<'OtpSession'> | bigint | number
    sessionId?: StringWithAggregatesFilter<'OtpSession'> | string
    purpose?: EnumOtpPurposeWithAggregatesFilter<'OtpSession'> | $Enums.OtpPurpose
    phone?: StringWithAggregatesFilter<'OtpSession'> | string
    destinationMasked?: StringWithAggregatesFilter<'OtpSession'> | string
    expiresAt?: DateTimeWithAggregatesFilter<'OtpSession'> | Date | string
    attempts?: IntWithAggregatesFilter<'OtpSession'> | number
    otpCode?: StringNullableWithAggregatesFilter<'OtpSession'> | string | null
    verifiedAt?: DateTimeNullableWithAggregatesFilter<'OtpSession'> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<'OtpSession'> | Date | string
  }

  export type RefreshTokenWhereInput = {
    AND?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    OR?: RefreshTokenWhereInput[]
    NOT?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
    id?: BigIntFilter<'RefreshToken'> | bigint | number
    tokenHash?: StringFilter<'RefreshToken'> | string
    userSub?: StringFilter<'RefreshToken'> | string
    name?: StringFilter<'RefreshToken'> | string
    role?: StringFilter<'RefreshToken'> | string
    email?: StringFilter<'RefreshToken'> | string
    expiresAt?: DateTimeFilter<'RefreshToken'> | Date | string
    revokedAt?: DateTimeNullableFilter<'RefreshToken'> | Date | string | null
    createdAt?: DateTimeFilter<'RefreshToken'> | Date | string
  }

  export type RefreshTokenOrderByWithRelationInput = {
    id?: SortOrder
    tokenHash?: SortOrder
    userSub?: SortOrder
    name?: SortOrder
    role?: SortOrder
    email?: SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type RefreshTokenWhereUniqueInput = Prisma.AtLeast<
    {
      id?: bigint | number
      tokenHash?: string
      AND?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
      OR?: RefreshTokenWhereInput[]
      NOT?: RefreshTokenWhereInput | RefreshTokenWhereInput[]
      userSub?: StringFilter<'RefreshToken'> | string
      name?: StringFilter<'RefreshToken'> | string
      role?: StringFilter<'RefreshToken'> | string
      email?: StringFilter<'RefreshToken'> | string
      expiresAt?: DateTimeFilter<'RefreshToken'> | Date | string
      revokedAt?: DateTimeNullableFilter<'RefreshToken'> | Date | string | null
      createdAt?: DateTimeFilter<'RefreshToken'> | Date | string
    },
    'id' | 'tokenHash'
  >

  export type RefreshTokenOrderByWithAggregationInput = {
    id?: SortOrder
    tokenHash?: SortOrder
    userSub?: SortOrder
    name?: SortOrder
    role?: SortOrder
    email?: SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: RefreshTokenCountOrderByAggregateInput
    _avg?: RefreshTokenAvgOrderByAggregateInput
    _max?: RefreshTokenMaxOrderByAggregateInput
    _min?: RefreshTokenMinOrderByAggregateInput
    _sum?: RefreshTokenSumOrderByAggregateInput
  }

  export type RefreshTokenScalarWhereWithAggregatesInput = {
    AND?: RefreshTokenScalarWhereWithAggregatesInput | RefreshTokenScalarWhereWithAggregatesInput[]
    OR?: RefreshTokenScalarWhereWithAggregatesInput[]
    NOT?: RefreshTokenScalarWhereWithAggregatesInput | RefreshTokenScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<'RefreshToken'> | bigint | number
    tokenHash?: StringWithAggregatesFilter<'RefreshToken'> | string
    userSub?: StringWithAggregatesFilter<'RefreshToken'> | string
    name?: StringWithAggregatesFilter<'RefreshToken'> | string
    role?: StringWithAggregatesFilter<'RefreshToken'> | string
    email?: StringWithAggregatesFilter<'RefreshToken'> | string
    expiresAt?: DateTimeWithAggregatesFilter<'RefreshToken'> | Date | string
    revokedAt?: DateTimeNullableWithAggregatesFilter<'RefreshToken'> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<'RefreshToken'> | Date | string
  }

  export type TenantCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    slug: string
    type: $Enums.TenantType
    board?: string | null
    logoUrl?: string | null
    city: string
    state: string
    country?: string
    address?: string | null
    pincode?: string | null
    phone?: string | null
    dbName: string
    dbHost?: string
    dbPort?: number
    plan?: $Enums.SubscriptionPlan
    status?: $Enums.TenantStatus
    trialEndsAt?: Date | string | null
    subscriptionStart?: Date | string | null
    subscriptionEnd?: Date | string | null
    monthlyFeeInr?: Decimal | DecimalJsLike | number | string | null
    adminName: string
    adminEmail: string
    adminPhone?: string | null
    totalStudents?: number
    totalStaff?: number
    institutionCode?: string
    auditLogs?: TenantAuditLogCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    slug: string
    type: $Enums.TenantType
    board?: string | null
    logoUrl?: string | null
    city: string
    state: string
    country?: string
    address?: string | null
    pincode?: string | null
    phone?: string | null
    dbName: string
    dbHost?: string
    dbPort?: number
    plan?: $Enums.SubscriptionPlan
    status?: $Enums.TenantStatus
    trialEndsAt?: Date | string | null
    subscriptionStart?: Date | string | null
    subscriptionEnd?: Date | string | null
    monthlyFeeInr?: Decimal | DecimalJsLike | number | string | null
    adminName: string
    adminEmail: string
    adminPhone?: string | null
    totalStudents?: number
    totalStaff?: number
    institutionCode?: string
    auditLogs?: TenantAuditLogUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    type?: EnumTenantTypeFieldUpdateOperationsInput | $Enums.TenantType
    board?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    pincode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    dbName?: StringFieldUpdateOperationsInput | string
    dbHost?: StringFieldUpdateOperationsInput | string
    dbPort?: IntFieldUpdateOperationsInput | number
    plan?: EnumSubscriptionPlanFieldUpdateOperationsInput | $Enums.SubscriptionPlan
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyFeeInr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    adminName?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    adminPhone?: NullableStringFieldUpdateOperationsInput | string | null
    totalStudents?: IntFieldUpdateOperationsInput | number
    totalStaff?: IntFieldUpdateOperationsInput | number
    institutionCode?: StringFieldUpdateOperationsInput | string
    auditLogs?: TenantAuditLogUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    type?: EnumTenantTypeFieldUpdateOperationsInput | $Enums.TenantType
    board?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    pincode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    dbName?: StringFieldUpdateOperationsInput | string
    dbHost?: StringFieldUpdateOperationsInput | string
    dbPort?: IntFieldUpdateOperationsInput | number
    plan?: EnumSubscriptionPlanFieldUpdateOperationsInput | $Enums.SubscriptionPlan
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyFeeInr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    adminName?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    adminPhone?: NullableStringFieldUpdateOperationsInput | string | null
    totalStudents?: IntFieldUpdateOperationsInput | number
    totalStaff?: IntFieldUpdateOperationsInput | number
    institutionCode?: StringFieldUpdateOperationsInput | string
    auditLogs?: TenantAuditLogUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    slug: string
    type: $Enums.TenantType
    board?: string | null
    logoUrl?: string | null
    city: string
    state: string
    country?: string
    address?: string | null
    pincode?: string | null
    phone?: string | null
    dbName: string
    dbHost?: string
    dbPort?: number
    plan?: $Enums.SubscriptionPlan
    status?: $Enums.TenantStatus
    trialEndsAt?: Date | string | null
    subscriptionStart?: Date | string | null
    subscriptionEnd?: Date | string | null
    monthlyFeeInr?: Decimal | DecimalJsLike | number | string | null
    adminName: string
    adminEmail: string
    adminPhone?: string | null
    totalStudents?: number
    totalStaff?: number
    institutionCode?: string
  }

  export type TenantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    type?: EnumTenantTypeFieldUpdateOperationsInput | $Enums.TenantType
    board?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    pincode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    dbName?: StringFieldUpdateOperationsInput | string
    dbHost?: StringFieldUpdateOperationsInput | string
    dbPort?: IntFieldUpdateOperationsInput | number
    plan?: EnumSubscriptionPlanFieldUpdateOperationsInput | $Enums.SubscriptionPlan
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyFeeInr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    adminName?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    adminPhone?: NullableStringFieldUpdateOperationsInput | string | null
    totalStudents?: IntFieldUpdateOperationsInput | number
    totalStaff?: IntFieldUpdateOperationsInput | number
    institutionCode?: StringFieldUpdateOperationsInput | string
  }

  export type TenantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    type?: EnumTenantTypeFieldUpdateOperationsInput | $Enums.TenantType
    board?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    pincode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    dbName?: StringFieldUpdateOperationsInput | string
    dbHost?: StringFieldUpdateOperationsInput | string
    dbPort?: IntFieldUpdateOperationsInput | number
    plan?: EnumSubscriptionPlanFieldUpdateOperationsInput | $Enums.SubscriptionPlan
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyFeeInr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    adminName?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    adminPhone?: NullableStringFieldUpdateOperationsInput | string | null
    totalStudents?: IntFieldUpdateOperationsInput | number
    totalStaff?: IntFieldUpdateOperationsInput | number
    institutionCode?: StringFieldUpdateOperationsInput | string
  }

  export type TenantAuditLogCreateInput = {
    id?: bigint | number
    createdAt?: Date | string
    action: string
    performedBy: string
    details?: NullableJsonNullValueInput | InputJsonValue
    tenant: TenantCreateNestedOneWithoutAuditLogsInput
  }

  export type TenantAuditLogUncheckedCreateInput = {
    id?: bigint | number
    createdAt?: Date | string
    tenantId: string
    action: string
    performedBy: string
    details?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TenantAuditLogUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    action?: StringFieldUpdateOperationsInput | string
    performedBy?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    tenant?: TenantUpdateOneRequiredWithoutAuditLogsNestedInput
  }

  export type TenantAuditLogUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    performedBy?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TenantAuditLogCreateManyInput = {
    id?: bigint | number
    createdAt?: Date | string
    tenantId: string
    action: string
    performedBy: string
    details?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TenantAuditLogUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    action?: StringFieldUpdateOperationsInput | string
    performedBy?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TenantAuditLogUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenantId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    performedBy?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
  }

  export type SuperAdminCreateInput = {
    id?: bigint | number
    createdAt?: Date | string
    name: string
    email: string
    passwordHash: string
    lastLoginAt?: Date | string | null
    isActive?: boolean
  }

  export type SuperAdminUncheckedCreateInput = {
    id?: bigint | number
    createdAt?: Date | string
    name: string
    email: string
    passwordHash: string
    lastLoginAt?: Date | string | null
    isActive?: boolean
  }

  export type SuperAdminUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SuperAdminUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SuperAdminCreateManyInput = {
    id?: bigint | number
    createdAt?: Date | string
    name: string
    email: string
    passwordHash: string
    lastLoginAt?: Date | string | null
    isActive?: boolean
  }

  export type SuperAdminUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SuperAdminUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type OtpSessionCreateInput = {
    id?: bigint | number
    sessionId: string
    purpose?: $Enums.OtpPurpose
    phone: string
    destinationMasked: string
    expiresAt: Date | string
    attempts?: number
    otpCode?: string | null
    verifiedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type OtpSessionUncheckedCreateInput = {
    id?: bigint | number
    sessionId: string
    purpose?: $Enums.OtpPurpose
    phone: string
    destinationMasked: string
    expiresAt: Date | string
    attempts?: number
    otpCode?: string | null
    verifiedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type OtpSessionUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    sessionId?: StringFieldUpdateOperationsInput | string
    purpose?: EnumOtpPurposeFieldUpdateOperationsInput | $Enums.OtpPurpose
    phone?: StringFieldUpdateOperationsInput | string
    destinationMasked?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attempts?: IntFieldUpdateOperationsInput | number
    otpCode?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OtpSessionUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    sessionId?: StringFieldUpdateOperationsInput | string
    purpose?: EnumOtpPurposeFieldUpdateOperationsInput | $Enums.OtpPurpose
    phone?: StringFieldUpdateOperationsInput | string
    destinationMasked?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attempts?: IntFieldUpdateOperationsInput | number
    otpCode?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OtpSessionCreateManyInput = {
    id?: bigint | number
    sessionId: string
    purpose?: $Enums.OtpPurpose
    phone: string
    destinationMasked: string
    expiresAt: Date | string
    attempts?: number
    otpCode?: string | null
    verifiedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type OtpSessionUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    sessionId?: StringFieldUpdateOperationsInput | string
    purpose?: EnumOtpPurposeFieldUpdateOperationsInput | $Enums.OtpPurpose
    phone?: StringFieldUpdateOperationsInput | string
    destinationMasked?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attempts?: IntFieldUpdateOperationsInput | number
    otpCode?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OtpSessionUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    sessionId?: StringFieldUpdateOperationsInput | string
    purpose?: EnumOtpPurposeFieldUpdateOperationsInput | $Enums.OtpPurpose
    phone?: StringFieldUpdateOperationsInput | string
    destinationMasked?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attempts?: IntFieldUpdateOperationsInput | number
    otpCode?: NullableStringFieldUpdateOperationsInput | string | null
    verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenCreateInput = {
    id?: bigint | number
    tokenHash: string
    userSub: string
    name: string
    role: string
    email: string
    expiresAt: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RefreshTokenUncheckedCreateInput = {
    id?: bigint | number
    tokenHash: string
    userSub: string
    name: string
    role: string
    email: string
    expiresAt: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RefreshTokenUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    tokenHash?: StringFieldUpdateOperationsInput | string
    userSub?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    tokenHash?: StringFieldUpdateOperationsInput | string
    userSub?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenCreateManyInput = {
    id?: bigint | number
    tokenHash: string
    userSub: string
    name: string
    role: string
    email: string
    expiresAt: Date | string
    revokedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type RefreshTokenUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    tokenHash?: StringFieldUpdateOperationsInput | string
    userSub?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RefreshTokenUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    tokenHash?: StringFieldUpdateOperationsInput | string
    userSub?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    revokedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type EnumTenantTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantType | EnumTenantTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TenantType[] | ListEnumTenantTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantType[] | ListEnumTenantTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantTypeFilter<$PrismaModel> | $Enums.TenantType
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumSubscriptionPlanFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionPlan | EnumSubscriptionPlanFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionPlan[] | ListEnumSubscriptionPlanFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionPlan[] | ListEnumSubscriptionPlanFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionPlanFilter<$PrismaModel> | $Enums.SubscriptionPlan
  }

  export type EnumTenantStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantStatus | EnumTenantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantStatusFilter<$PrismaModel> | $Enums.TenantStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type TenantAuditLogListRelationFilter = {
    every?: TenantAuditLogWhereInput
    some?: TenantAuditLogWhereInput
    none?: TenantAuditLogWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TenantAuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    type?: SortOrder
    board?: SortOrder
    logoUrl?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    address?: SortOrder
    pincode?: SortOrder
    phone?: SortOrder
    dbName?: SortOrder
    dbHost?: SortOrder
    dbPort?: SortOrder
    plan?: SortOrder
    status?: SortOrder
    trialEndsAt?: SortOrder
    subscriptionStart?: SortOrder
    subscriptionEnd?: SortOrder
    monthlyFeeInr?: SortOrder
    adminName?: SortOrder
    adminEmail?: SortOrder
    adminPhone?: SortOrder
    totalStudents?: SortOrder
    totalStaff?: SortOrder
    institutionCode?: SortOrder
  }

  export type TenantAvgOrderByAggregateInput = {
    dbPort?: SortOrder
    monthlyFeeInr?: SortOrder
    totalStudents?: SortOrder
    totalStaff?: SortOrder
  }

  export type TenantMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    type?: SortOrder
    board?: SortOrder
    logoUrl?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    address?: SortOrder
    pincode?: SortOrder
    phone?: SortOrder
    dbName?: SortOrder
    dbHost?: SortOrder
    dbPort?: SortOrder
    plan?: SortOrder
    status?: SortOrder
    trialEndsAt?: SortOrder
    subscriptionStart?: SortOrder
    subscriptionEnd?: SortOrder
    monthlyFeeInr?: SortOrder
    adminName?: SortOrder
    adminEmail?: SortOrder
    adminPhone?: SortOrder
    totalStudents?: SortOrder
    totalStaff?: SortOrder
    institutionCode?: SortOrder
  }

  export type TenantMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    name?: SortOrder
    slug?: SortOrder
    type?: SortOrder
    board?: SortOrder
    logoUrl?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    address?: SortOrder
    pincode?: SortOrder
    phone?: SortOrder
    dbName?: SortOrder
    dbHost?: SortOrder
    dbPort?: SortOrder
    plan?: SortOrder
    status?: SortOrder
    trialEndsAt?: SortOrder
    subscriptionStart?: SortOrder
    subscriptionEnd?: SortOrder
    monthlyFeeInr?: SortOrder
    adminName?: SortOrder
    adminEmail?: SortOrder
    adminPhone?: SortOrder
    totalStudents?: SortOrder
    totalStaff?: SortOrder
    institutionCode?: SortOrder
  }

  export type TenantSumOrderByAggregateInput = {
    dbPort?: SortOrder
    monthlyFeeInr?: SortOrder
    totalStudents?: SortOrder
    totalStaff?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumTenantTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantType | EnumTenantTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TenantType[] | ListEnumTenantTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantType[] | ListEnumTenantTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantTypeWithAggregatesFilter<$PrismaModel> | $Enums.TenantType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTenantTypeFilter<$PrismaModel>
    _max?: NestedEnumTenantTypeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumSubscriptionPlanWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionPlan | EnumSubscriptionPlanFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionPlan[] | ListEnumSubscriptionPlanFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionPlan[] | ListEnumSubscriptionPlanFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionPlanWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionPlan
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionPlanFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionPlanFilter<$PrismaModel>
  }

  export type EnumTenantStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantStatus | EnumTenantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantStatusWithAggregatesFilter<$PrismaModel> | $Enums.TenantStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTenantStatusFilter<$PrismaModel>
    _max?: NestedEnumTenantStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonNullableFilterBase<$PrismaModel>>,
          Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>
        >,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type TenantScalarRelationFilter = {
    is?: TenantWhereInput
    isNot?: TenantWhereInput
  }

  export type TenantAuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    tenantId?: SortOrder
    action?: SortOrder
    performedBy?: SortOrder
    details?: SortOrder
  }

  export type TenantAuditLogAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type TenantAuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    tenantId?: SortOrder
    action?: SortOrder
    performedBy?: SortOrder
  }

  export type TenantAuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    tenantId?: SortOrder
    action?: SortOrder
    performedBy?: SortOrder
  }

  export type TenantAuditLogSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
          Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>
        >,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type SuperAdminCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    lastLoginAt?: SortOrder
    isActive?: SortOrder
  }

  export type SuperAdminAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SuperAdminMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    lastLoginAt?: SortOrder
    isActive?: SortOrder
  }

  export type SuperAdminMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    lastLoginAt?: SortOrder
    isActive?: SortOrder
  }

  export type SuperAdminSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumOtpPurposeFilter<$PrismaModel = never> = {
    equals?: $Enums.OtpPurpose | EnumOtpPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.OtpPurpose[] | ListEnumOtpPurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.OtpPurpose[] | ListEnumOtpPurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumOtpPurposeFilter<$PrismaModel> | $Enums.OtpPurpose
  }

  export type OtpSessionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    purpose?: SortOrder
    phone?: SortOrder
    destinationMasked?: SortOrder
    expiresAt?: SortOrder
    attempts?: SortOrder
    otpCode?: SortOrder
    verifiedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type OtpSessionAvgOrderByAggregateInput = {
    id?: SortOrder
    attempts?: SortOrder
  }

  export type OtpSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    purpose?: SortOrder
    phone?: SortOrder
    destinationMasked?: SortOrder
    expiresAt?: SortOrder
    attempts?: SortOrder
    otpCode?: SortOrder
    verifiedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type OtpSessionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    purpose?: SortOrder
    phone?: SortOrder
    destinationMasked?: SortOrder
    expiresAt?: SortOrder
    attempts?: SortOrder
    otpCode?: SortOrder
    verifiedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type OtpSessionSumOrderByAggregateInput = {
    id?: SortOrder
    attempts?: SortOrder
  }

  export type EnumOtpPurposeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OtpPurpose | EnumOtpPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.OtpPurpose[] | ListEnumOtpPurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.OtpPurpose[] | ListEnumOtpPurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumOtpPurposeWithAggregatesFilter<$PrismaModel> | $Enums.OtpPurpose
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOtpPurposeFilter<$PrismaModel>
    _max?: NestedEnumOtpPurposeFilter<$PrismaModel>
  }

  export type RefreshTokenCountOrderByAggregateInput = {
    id?: SortOrder
    tokenHash?: SortOrder
    userSub?: SortOrder
    name?: SortOrder
    role?: SortOrder
    email?: SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RefreshTokenAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type RefreshTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    tokenHash?: SortOrder
    userSub?: SortOrder
    name?: SortOrder
    role?: SortOrder
    email?: SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RefreshTokenMinOrderByAggregateInput = {
    id?: SortOrder
    tokenHash?: SortOrder
    userSub?: SortOrder
    name?: SortOrder
    role?: SortOrder
    email?: SortOrder
    expiresAt?: SortOrder
    revokedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type RefreshTokenSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type TenantAuditLogCreateNestedManyWithoutTenantInput = {
    create?:
      | XOR<TenantAuditLogCreateWithoutTenantInput, TenantAuditLogUncheckedCreateWithoutTenantInput>
      | TenantAuditLogCreateWithoutTenantInput[]
      | TenantAuditLogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?:
      | TenantAuditLogCreateOrConnectWithoutTenantInput
      | TenantAuditLogCreateOrConnectWithoutTenantInput[]
    createMany?: TenantAuditLogCreateManyTenantInputEnvelope
    connect?: TenantAuditLogWhereUniqueInput | TenantAuditLogWhereUniqueInput[]
  }

  export type TenantAuditLogUncheckedCreateNestedManyWithoutTenantInput = {
    create?:
      | XOR<TenantAuditLogCreateWithoutTenantInput, TenantAuditLogUncheckedCreateWithoutTenantInput>
      | TenantAuditLogCreateWithoutTenantInput[]
      | TenantAuditLogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?:
      | TenantAuditLogCreateOrConnectWithoutTenantInput
      | TenantAuditLogCreateOrConnectWithoutTenantInput[]
    createMany?: TenantAuditLogCreateManyTenantInputEnvelope
    connect?: TenantAuditLogWhereUniqueInput | TenantAuditLogWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EnumTenantTypeFieldUpdateOperationsInput = {
    set?: $Enums.TenantType
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumSubscriptionPlanFieldUpdateOperationsInput = {
    set?: $Enums.SubscriptionPlan
  }

  export type EnumTenantStatusFieldUpdateOperationsInput = {
    set?: $Enums.TenantStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type TenantAuditLogUpdateManyWithoutTenantNestedInput = {
    create?:
      | XOR<TenantAuditLogCreateWithoutTenantInput, TenantAuditLogUncheckedCreateWithoutTenantInput>
      | TenantAuditLogCreateWithoutTenantInput[]
      | TenantAuditLogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?:
      | TenantAuditLogCreateOrConnectWithoutTenantInput
      | TenantAuditLogCreateOrConnectWithoutTenantInput[]
    upsert?:
      | TenantAuditLogUpsertWithWhereUniqueWithoutTenantInput
      | TenantAuditLogUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TenantAuditLogCreateManyTenantInputEnvelope
    set?: TenantAuditLogWhereUniqueInput | TenantAuditLogWhereUniqueInput[]
    disconnect?: TenantAuditLogWhereUniqueInput | TenantAuditLogWhereUniqueInput[]
    delete?: TenantAuditLogWhereUniqueInput | TenantAuditLogWhereUniqueInput[]
    connect?: TenantAuditLogWhereUniqueInput | TenantAuditLogWhereUniqueInput[]
    update?:
      | TenantAuditLogUpdateWithWhereUniqueWithoutTenantInput
      | TenantAuditLogUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?:
      | TenantAuditLogUpdateManyWithWhereWithoutTenantInput
      | TenantAuditLogUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TenantAuditLogScalarWhereInput | TenantAuditLogScalarWhereInput[]
  }

  export type TenantAuditLogUncheckedUpdateManyWithoutTenantNestedInput = {
    create?:
      | XOR<TenantAuditLogCreateWithoutTenantInput, TenantAuditLogUncheckedCreateWithoutTenantInput>
      | TenantAuditLogCreateWithoutTenantInput[]
      | TenantAuditLogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?:
      | TenantAuditLogCreateOrConnectWithoutTenantInput
      | TenantAuditLogCreateOrConnectWithoutTenantInput[]
    upsert?:
      | TenantAuditLogUpsertWithWhereUniqueWithoutTenantInput
      | TenantAuditLogUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TenantAuditLogCreateManyTenantInputEnvelope
    set?: TenantAuditLogWhereUniqueInput | TenantAuditLogWhereUniqueInput[]
    disconnect?: TenantAuditLogWhereUniqueInput | TenantAuditLogWhereUniqueInput[]
    delete?: TenantAuditLogWhereUniqueInput | TenantAuditLogWhereUniqueInput[]
    connect?: TenantAuditLogWhereUniqueInput | TenantAuditLogWhereUniqueInput[]
    update?:
      | TenantAuditLogUpdateWithWhereUniqueWithoutTenantInput
      | TenantAuditLogUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?:
      | TenantAuditLogUpdateManyWithWhereWithoutTenantInput
      | TenantAuditLogUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TenantAuditLogScalarWhereInput | TenantAuditLogScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<TenantCreateWithoutAuditLogsInput, TenantUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutAuditLogsInput
    connect?: TenantWhereUniqueInput
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type TenantUpdateOneRequiredWithoutAuditLogsNestedInput = {
    create?: XOR<TenantCreateWithoutAuditLogsInput, TenantUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutAuditLogsInput
    upsert?: TenantUpsertWithoutAuditLogsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<
      XOR<TenantUpdateToOneWithWhereWithoutAuditLogsInput, TenantUpdateWithoutAuditLogsInput>,
      TenantUncheckedUpdateWithoutAuditLogsInput
    >
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EnumOtpPurposeFieldUpdateOperationsInput = {
    set?: $Enums.OtpPurpose
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedEnumTenantTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantType | EnumTenantTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TenantType[] | ListEnumTenantTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantType[] | ListEnumTenantTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantTypeFilter<$PrismaModel> | $Enums.TenantType
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumSubscriptionPlanFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionPlan | EnumSubscriptionPlanFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionPlan[] | ListEnumSubscriptionPlanFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionPlan[] | ListEnumSubscriptionPlanFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionPlanFilter<$PrismaModel> | $Enums.SubscriptionPlan
  }

  export type NestedEnumTenantStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantStatus | EnumTenantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantStatusFilter<$PrismaModel> | $Enums.TenantStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumTenantTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantType | EnumTenantTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TenantType[] | ListEnumTenantTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantType[] | ListEnumTenantTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantTypeWithAggregatesFilter<$PrismaModel> | $Enums.TenantType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTenantTypeFilter<$PrismaModel>
    _max?: NestedEnumTenantTypeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumSubscriptionPlanWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionPlan | EnumSubscriptionPlanFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionPlan[] | ListEnumSubscriptionPlanFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionPlan[] | ListEnumSubscriptionPlanFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionPlanWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionPlan
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionPlanFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionPlanFilter<$PrismaModel>
  }

  export type NestedEnumTenantStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantStatus | EnumTenantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantStatusWithAggregatesFilter<$PrismaModel> | $Enums.TenantStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTenantStatusFilter<$PrismaModel>
    _max?: NestedEnumTenantStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<
          Required<NestedJsonNullableFilterBase<$PrismaModel>>,
          Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>
        >,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumOtpPurposeFilter<$PrismaModel = never> = {
    equals?: $Enums.OtpPurpose | EnumOtpPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.OtpPurpose[] | ListEnumOtpPurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.OtpPurpose[] | ListEnumOtpPurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumOtpPurposeFilter<$PrismaModel> | $Enums.OtpPurpose
  }

  export type NestedEnumOtpPurposeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OtpPurpose | EnumOtpPurposeFieldRefInput<$PrismaModel>
    in?: $Enums.OtpPurpose[] | ListEnumOtpPurposeFieldRefInput<$PrismaModel>
    notIn?: $Enums.OtpPurpose[] | ListEnumOtpPurposeFieldRefInput<$PrismaModel>
    not?: NestedEnumOtpPurposeWithAggregatesFilter<$PrismaModel> | $Enums.OtpPurpose
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumOtpPurposeFilter<$PrismaModel>
    _max?: NestedEnumOtpPurposeFilter<$PrismaModel>
  }

  export type TenantAuditLogCreateWithoutTenantInput = {
    id?: bigint | number
    createdAt?: Date | string
    action: string
    performedBy: string
    details?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TenantAuditLogUncheckedCreateWithoutTenantInput = {
    id?: bigint | number
    createdAt?: Date | string
    action: string
    performedBy: string
    details?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TenantAuditLogCreateOrConnectWithoutTenantInput = {
    where: TenantAuditLogWhereUniqueInput
    create: XOR<TenantAuditLogCreateWithoutTenantInput, TenantAuditLogUncheckedCreateWithoutTenantInput>
  }

  export type TenantAuditLogCreateManyTenantInputEnvelope = {
    data: TenantAuditLogCreateManyTenantInput | TenantAuditLogCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type TenantAuditLogUpsertWithWhereUniqueWithoutTenantInput = {
    where: TenantAuditLogWhereUniqueInput
    update: XOR<TenantAuditLogUpdateWithoutTenantInput, TenantAuditLogUncheckedUpdateWithoutTenantInput>
    create: XOR<TenantAuditLogCreateWithoutTenantInput, TenantAuditLogUncheckedCreateWithoutTenantInput>
  }

  export type TenantAuditLogUpdateWithWhereUniqueWithoutTenantInput = {
    where: TenantAuditLogWhereUniqueInput
    data: XOR<TenantAuditLogUpdateWithoutTenantInput, TenantAuditLogUncheckedUpdateWithoutTenantInput>
  }

  export type TenantAuditLogUpdateManyWithWhereWithoutTenantInput = {
    where: TenantAuditLogScalarWhereInput
    data: XOR<TenantAuditLogUpdateManyMutationInput, TenantAuditLogUncheckedUpdateManyWithoutTenantInput>
  }

  export type TenantAuditLogScalarWhereInput = {
    AND?: TenantAuditLogScalarWhereInput | TenantAuditLogScalarWhereInput[]
    OR?: TenantAuditLogScalarWhereInput[]
    NOT?: TenantAuditLogScalarWhereInput | TenantAuditLogScalarWhereInput[]
    id?: BigIntFilter<'TenantAuditLog'> | bigint | number
    createdAt?: DateTimeFilter<'TenantAuditLog'> | Date | string
    tenantId?: StringFilter<'TenantAuditLog'> | string
    action?: StringFilter<'TenantAuditLog'> | string
    performedBy?: StringFilter<'TenantAuditLog'> | string
    details?: JsonNullableFilter<'TenantAuditLog'>
  }

  export type TenantCreateWithoutAuditLogsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    slug: string
    type: $Enums.TenantType
    board?: string | null
    logoUrl?: string | null
    city: string
    state: string
    country?: string
    address?: string | null
    pincode?: string | null
    phone?: string | null
    dbName: string
    dbHost?: string
    dbPort?: number
    plan?: $Enums.SubscriptionPlan
    status?: $Enums.TenantStatus
    trialEndsAt?: Date | string | null
    subscriptionStart?: Date | string | null
    subscriptionEnd?: Date | string | null
    monthlyFeeInr?: Decimal | DecimalJsLike | number | string | null
    adminName: string
    adminEmail: string
    adminPhone?: string | null
    totalStudents?: number
    totalStaff?: number
    institutionCode?: string
  }

  export type TenantUncheckedCreateWithoutAuditLogsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    name: string
    slug: string
    type: $Enums.TenantType
    board?: string | null
    logoUrl?: string | null
    city: string
    state: string
    country?: string
    address?: string | null
    pincode?: string | null
    phone?: string | null
    dbName: string
    dbHost?: string
    dbPort?: number
    plan?: $Enums.SubscriptionPlan
    status?: $Enums.TenantStatus
    trialEndsAt?: Date | string | null
    subscriptionStart?: Date | string | null
    subscriptionEnd?: Date | string | null
    monthlyFeeInr?: Decimal | DecimalJsLike | number | string | null
    adminName: string
    adminEmail: string
    adminPhone?: string | null
    totalStudents?: number
    totalStaff?: number
    institutionCode?: string
  }

  export type TenantCreateOrConnectWithoutAuditLogsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutAuditLogsInput, TenantUncheckedCreateWithoutAuditLogsInput>
  }

  export type TenantUpsertWithoutAuditLogsInput = {
    update: XOR<TenantUpdateWithoutAuditLogsInput, TenantUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<TenantCreateWithoutAuditLogsInput, TenantUncheckedCreateWithoutAuditLogsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutAuditLogsInput, TenantUncheckedUpdateWithoutAuditLogsInput>
  }

  export type TenantUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    type?: EnumTenantTypeFieldUpdateOperationsInput | $Enums.TenantType
    board?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    pincode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    dbName?: StringFieldUpdateOperationsInput | string
    dbHost?: StringFieldUpdateOperationsInput | string
    dbPort?: IntFieldUpdateOperationsInput | number
    plan?: EnumSubscriptionPlanFieldUpdateOperationsInput | $Enums.SubscriptionPlan
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyFeeInr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    adminName?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    adminPhone?: NullableStringFieldUpdateOperationsInput | string | null
    totalStudents?: IntFieldUpdateOperationsInput | number
    totalStaff?: IntFieldUpdateOperationsInput | number
    institutionCode?: StringFieldUpdateOperationsInput | string
  }

  export type TenantUncheckedUpdateWithoutAuditLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    name?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    type?: EnumTenantTypeFieldUpdateOperationsInput | $Enums.TenantType
    board?: NullableStringFieldUpdateOperationsInput | string | null
    logoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    pincode?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    dbName?: StringFieldUpdateOperationsInput | string
    dbHost?: StringFieldUpdateOperationsInput | string
    dbPort?: IntFieldUpdateOperationsInput | number
    plan?: EnumSubscriptionPlanFieldUpdateOperationsInput | $Enums.SubscriptionPlan
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyFeeInr?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    adminName?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    adminPhone?: NullableStringFieldUpdateOperationsInput | string | null
    totalStudents?: IntFieldUpdateOperationsInput | number
    totalStaff?: IntFieldUpdateOperationsInput | number
    institutionCode?: StringFieldUpdateOperationsInput | string
  }

  export type TenantAuditLogCreateManyTenantInput = {
    id?: bigint | number
    createdAt?: Date | string
    action: string
    performedBy: string
    details?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TenantAuditLogUpdateWithoutTenantInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    action?: StringFieldUpdateOperationsInput | string
    performedBy?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TenantAuditLogUncheckedUpdateWithoutTenantInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    action?: StringFieldUpdateOperationsInput | string
    performedBy?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TenantAuditLogUncheckedUpdateManyWithoutTenantInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    action?: StringFieldUpdateOperationsInput | string
    performedBy?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
  }

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
