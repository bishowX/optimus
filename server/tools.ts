import { AssistantTool } from "openai/resources/beta/assistants.mjs"

export const tools: AssistantTool[] = [
    {
        type: "function",
        function: {
            name: "fetchContent",
            description: "Retrieve content based on various criteria",
            parameters: {
                type: "object",
                properties: {
                    filters: {
                        type: "object",
                        description: "Filters to apply to the content search",
                    },
                    sortBy: {
                        type: "string",
                        description: "Field to sort the content by",
                    },
                    order: {
                        type: "string",
                        enum: ["asc", "desc"],
                        description: "Sort order",
                    },
                    page: {
                        type: "integer",
                        description: "Page number for pagination",
                    },
                    pageSize: {
                        type: "integer",
                        description: "Number of items per page",
                    },
                },
                required: ["filters"],
            },
        },
    },

    {
        type: "function",
        function: {
            name: "navigateTo",
            description: "Navigate to a specific route in the web app",
            parameters: {
                type: "object",
                properties: {
                    route: {
                        type: "string",
                        description: "The route to navigate to",
                    },
                },
                required: ["route"],
            },
        },
    },

    {
        type: "function",
        function: {
            name: "updateUserPreferences",
            description: "Update user preferences including theme",
            parameters: {
                type: "object",
                properties: {
                    theme: {
                        type: "string",
                        enum: ["dark", "light", "system"],
                        description: "The theme preference",
                    },
                    otherPreferences: {
                        type: "object",
                        description: "Other user preferences to update",
                    },
                },
            },
        },
    },

    {
        type: "function",
        function: {
            name: "manageCategoriesAndTags",
            description: "Manage categories and tags for content",
            parameters: {
                type: "object",
                properties: {
                    action: {
                        type: "string",
                        enum: ["createCategory", "listCategories", "addTags"],
                        description: "Action to perform",
                    },
                    categoryName: {
                        type: "string",
                        description: "Name of the category to create",
                    },
                    contentId: {
                        type: "string",
                        description: "ID of the content to tag",
                    },
                    tags: {
                        type: "array",
                        items: {
                            type: "string",
                        },
                        description: "Tags to add to the content",
                    },
                },
                required: ["action"],
            },
        },
    },
]
