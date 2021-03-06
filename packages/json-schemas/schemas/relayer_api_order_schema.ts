export const relayerApiOrderSchema = {
    id: '/relayerApiOrderSchema',
    type: 'object',
    properties: {
        order: { $ref: '/orderSchema' },
        metaData: { type: 'object' },
    },
    required: ['order', 'metaData'],
};
