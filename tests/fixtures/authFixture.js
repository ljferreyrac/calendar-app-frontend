export const authInitialState = {
    status: 'checking',
    user: {},
    errorMessage: undefined,
}

export const authenticatedState = (user) => ({
    status: 'authenticated',
    user,
    errorMessage: undefined,
})

export const notAuthenticatedState = (errorMessage) => ({
    status: 'not-authenticated',
    user: {},
    errorMessage,
})