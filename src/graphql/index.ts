import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL!
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem("accessToken");
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `${token}` : ""
        },
    };
});


const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path, extensions }) => {

            if (extensions?.code === 'UN_AUTHORIZED') {
                // INVALID_CREDENTIALS (e.g. wrong current password) is a separate code, so it's not caught here.
                if (!window.location.pathname.includes('/sign-out')) {
                    window.location.href = '/sign-out';
                }
            }
        });
    }

    if (networkError) {
        const errorResponse = networkError as Error & { statusCode?: number };
        if (errorResponse.statusCode === 401) {

            if (!window.location.pathname.includes('/sign-out')) {
                window.location.href = '/sign-out';
            }
        }
    }
})


const link: ApolloLink = ApolloLink.from([errorLink, authLink.concat(httpLink)])

const client = new ApolloClient({
    // link: authLink.concat(httpLink),
    link,
    cache: new InMemoryCache(),
});

export default client