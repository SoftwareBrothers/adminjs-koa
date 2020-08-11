import { CurrentAdmin } from 'admin-bro'

/**
 * @memberof module:@admin-bro/koa
 * @alias KoaAuthenticateFunction
 *
 * @description
 * Authentication function
 */
export type KoaAuthenticateFunction = (
  /**
   * email address passed in a form
   */
  email: string,
  /**
   * Password passed in a form
   */
  password: string
) => Promise<CurrentAdmin | null>

/**
 * @memberof module:@admin-bro/koa
 * @alias KoaAuthOptions
 *
 * @description
 * Authentication options
 */
export type KoaAuthOptions = {
  /**
   * Function returning {@link CurrentAdmin}
   */
  authenticate: KoaAuthenticateFunction;
  /**
   * Cookie password
   */
  cookiePassword: string;
}
