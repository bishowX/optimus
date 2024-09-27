type Types = "string" | "number"

type Action = {
    description: string
    inputs: Record<string, Types>
}

const navigation: Action = {
    description: "Navigates to a given pathname",
    inputs: {
        pathname: "string",
    },
}

export const actions: Action[] = [navigation]
