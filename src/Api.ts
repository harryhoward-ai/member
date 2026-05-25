import axios from "axios"

export const AccountStatus = {
    Unvalidated: 0,
    Normal: 1,
    Frozen: 2,
    Deleted: 3,
} as const

export type AccountStatus = (typeof AccountStatus)[keyof typeof AccountStatus]

export const AccountType = {
    Email: 1,
    Telegram: 2,
    AppleId: 3,
} as const

export type AccountType = (typeof AccountType)[keyof typeof AccountType]

export type DashFunAccount = {
    account_id: string,
    username: string,
    type: AccountType,
    status: AccountStatus
    token: string,
    display_name: string,
}
const api_local = "http://localhost:8088/api/v1/"
const api_test = "https://dashfun-server-test.nexgami.com/api/v1/"
const api_prod = "https://server.harryhowardai.com/api/v1/"


const api_url = () => {
    const url = window.location.href;
    if (url.indexOf("://dashfun-test") >= 0) {
        //test环境允许http
        return api_test;
    }
    if (url.indexOf("harryhowardai.com") >= 0) {
        return api_prod;
    }
    if (url.indexOf("https://app.harryhowardai.com") >= 0) {
        return api_prod;
    }
    return api_local;
    // return api_test;
}

const dashFunApiUrl = api_url()

export const AccApi = {
    apiUrl: (): string => {
        return dashFunApiUrl + "acc/"
    },

    create: async (username: string, password: string, acc_type: AccountType): Promise<DashFunAccount> => {
        const api = AccApi.apiUrl() + "create";
        const result = await axios.post(api, {
            username,
            password,
            acc_type
        })
        if (result.status == 200) {
            if (result.data.code == 0) {
                return result.data.data;
            } else {
                throw result.data.msg
            }
        } else {
            throw result.status
        }
    },

    login: async (username: string, password: string, acc_type: AccountType): Promise<DashFunAccount> => {
        const api = AccApi.apiUrl() + "login"
        const result = await axios.post(api, {
            username,
            password,
            acc_type
        })
        if (result.status == 200) {
            if (result.data.code == 0) {
                return result.data.data;
            } else {
                throw result.data.msg
            }
        } else {
            throw result.status
        }
    },

    requestSendEmail: async (accountId: string): Promise<string> => {
        const api = AccApi.apiUrl() + "send_email"
        const result = await axios.post(api, {
            account_id: accountId
        })
        if (result.status == 200) {
            if (result.data.code == 0) {
                return result.data.data;
            } else {
                throw result.data.msg
            }
        } else {
            throw result.status
        }
    },

    verifyEmail: async (accountId: string, code: string): Promise<DashFunAccount> => {
        const api = AccApi.apiUrl() + "verify_email"
        const result = await axios.post(api, {
            account_id: accountId,
            code
        })
        if (result.status == 200) {
            if (result.data.code == 0) {
                return result.data.data;
            } else {
                throw result.data.msg
            }
        } else {
            throw result.status
        }
    },

    checkToken: async (accountId: string, token: string, acc_type: AccountType): Promise<DashFunAccount> => {
        const api = AccApi.apiUrl() + "check_token"
        const result = await axios.post(api, {
            account_id: accountId,
            token,
            acc_type
        })
        if (result.status == 200) {
            if (result.data.code == 0) {
                return result.data.data;
            } else {
                throw result.data.msg
            }
        } else {
            throw result.status
        }
    },

    requestResetPassword: async (username: string): Promise<string> => {
        const api = AccApi.apiUrl() + "request_reset_password"
        const result = await axios.post(api, {
            username
        })
        if (result.status == 200) {
            if (result.data.code == 0) {
                return result.data.data;
            } else {
                throw result.data.msg
            }
        } else {
            throw result.status
        }
    },

    resetPassword: async (username: string, code: string, password: string): Promise<string> => {
        const api = AccApi.apiUrl() + "reset_password"
        const result = await axios.post(api, {
            username,
            code,
            password
        })
        if (result.status == 200) {
            if (result.data.code == 0) {
                return result.data.data;
            } else {
                throw result.data.msg
            }
        } else {
            throw result.status
        }
    },

}

export default AccApi