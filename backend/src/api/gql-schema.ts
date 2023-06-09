import gql from 'graphql-tag'

const typeDefs = gql`
    type Query {
        hello: String,
        getSilo(siloId: ID!): Silo,
        getInstance(instanceId: ID!): Instance,
        getAllActiveSilos: [Silo],
        getInstancesOfSilo(siloId: ID!): [Instance]
    },
    type Mutation {
        createSilo(templateId: ID!, userVariables: [KeyValueInput]): Silo,
        destroySilo(siloId: ID!): Boolean,
        createInstance(siloId: ID!, templateId: ID!): Instance,
        destroyInstance(instanceId: ID!): Boolean,
        createTemplate(templateInput: TemplateInput!): Template,
        createAwsAccount(awsAccount: AwsAccountInput!): AccountId,
        createAzureAccount(azureAccount: AzureAccountInput!): AccountId,
        createGitAccount(gitAccount: GitAccountInput!): AccountId
    },
    enum ProviderType {
        AZURE
        AWS
        GCP
        HETZNER
        OVH
    },
    enum TemplateType {
        SILO
        INSTANCE
    },
    input AwsAccountInput {
        region: String!
        accessKey: String!
        secretKey: String!
    },
    input AzureAccountInput {
        subscriptionId: String!
        clientId: String!
        clientSecret: String!
        tenantId: String!
        resourceGroupName: String
    },
    input GitAccountInput {
        username: String!
        token: String!
        repositoryVendor: String
    },
    input TemplateInput {
        type: TemplateType!
        repoUrl: String
        repoPath: String
        repoPointer: String
        providers: [ProviderType]
        authAccounts: [ID]
        parentTemplates: [ID]
    },
    input KeyValueInput {
        key: String
        value: String
    },
    type AccountId {
        id: String
    },
    type Silo {
        id: ID!
        status: String
        properties: [KeyValue]
    },
    type Instance {
        id: ID!
        status: String
        properties: [KeyValue]
    },
    type KeyValue {
        key: String
        value: String
    },
    type Template {
        id: ID!
        status: String
    }
`

export default {
    typeDefs: typeDefs
}