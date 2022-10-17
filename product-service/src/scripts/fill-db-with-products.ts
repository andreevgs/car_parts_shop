import { v4 as uuidv4 } from 'uuid';
import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient({region: 'eu-west-1'});

const truncateAndFillDbWithDefaultData = async () => {
    const uuid1 = uuidv4();
    const uuid2 = uuidv4();
    const uuid3 = uuidv4();
    const uuid4 = uuidv4();
    const uuid5 = uuidv4();
    const uuid6 = uuidv4();
    const uuid7 = uuidv4();
    const uuid8 = uuidv4();

    try {
        await dynamoDb.transactWrite(
            {
                TransactItems: [
                    {
                        Put: {
                            Item: {
                                id: uuid1,
                                price: 60.4,
                                title: 'ATE Brake Disc (Front)',
                                description: 'ATE brakes have come as standard equipment on some of the world\'s finest cars since the 1930s.'
                            },
                            TableName: 'products',
                            ConditionExpression: 'attribute_not_exists(id)',
                        }
                    },
                    {
                        Put: {
                            Item: {
                                product_id: uuid1,
                                count: 4,
                            },
                            TableName: 'stocks',
                            ConditionExpression: 'attribute_not_exists(product_id)'
                        }
                    },

                    {
                        Put: {
                            Item: {
                                id: uuid2,
                                price: 70.14,
                                title: 'Textar Brake Disc (Rear)',
                                description: 'Most modern cars have disc brakes on the front wheels, and some have disc brakes on all four wheels.'
                            },
                            TableName: 'products',
                            ConditionExpression: 'attribute_not_exists(id)'
                        }
                    },
                    {
                        Put: {
                            Item: {
                                product_id: uuid2,
                                count: 6,
                            },
                            TableName: 'stocks',
                            ConditionExpression: 'attribute_not_exists(product_id)'
                        }
                    },

                    {
                        Put: {
                            Item: {
                                id: uuid3,
                                price: 33.1,
                                title: 'Mobil 1 FS Engine Oil - 0W-40 1Ltr',
                                description: 'Mobil 1 0W-40 is especially suitable for extreme conditions'
                            },
                            TableName: 'products',
                            ConditionExpression: 'attribute_not_exists(id)'
                        }
                    },
                    {
                        Put: {
                            Item: {
                                product_id: uuid3,
                                count: 7,
                            },
                            TableName: 'stocks',
                            ConditionExpression: 'attribute_not_exists(product_id)'
                        }
                    },

                    {
                        Put: {
                            Item: {
                                id: uuid4,
                                price: 51.39,
                                title: 'Milwaukee FLAP GRINDING DISC XL',
                                description: 'Maximum productivity with CERA TURBO™, 50% faster material removal and 2x longer lifetime'
                            },
                            TableName: 'products',
                            ConditionExpression: 'attribute_not_exists(id)'
                        }
                    },
                    {
                        Put: {
                            Item: {
                                product_id: uuid4,
                                count: 12,
                            },
                            TableName: 'stocks',
                            ConditionExpression: 'attribute_not_exists(product_id)'
                        }
                    },

                    {
                        Put: {
                            Item: {
                                id: uuid5,
                                price: 500,
                                title: 'Garrett 848212-5001S Chevrolet',
                                description: 'Garrett is an Original Equipment Manufacturer (OEM) to the world\'s largest diesel engine producers.'
                            },
                            TableName: 'products',
                            ConditionExpression: 'attribute_not_exists(id)'
                        }
                    },
                    {
                        Put: {
                            Item: {
                                product_id: uuid5,
                                count: 7,
                            },
                            TableName: 'stocks',
                            ConditionExpression: 'attribute_not_exists(product_id)'
                        }
                    },

                    {
                        Put: {
                            Item: {
                                id: uuid6,
                                price: 9299.9,
                                title: 'AKRAPOVIC EXHAUST AUDI RS6 C8 AVANT',
                                description: 'The long awaited exhaust from Akrapovic for the Audi RS6 C8 is now available.'
                            },
                            TableName: 'products',
                            ConditionExpression: 'attribute_not_exists(id)'
                        }
                    },
                    {
                        Put: {
                            Item: {
                                product_id: uuid6,
                                count: 8,
                            },
                            TableName: 'stocks',
                            ConditionExpression: 'attribute_not_exists(product_id)'
                        }
                    },

                    {
                        Put: {
                            Item: {
                                id: uuid7,
                                price: 123,
                                title: 'Power Stop (Z23-1084) Z23 Evolution Sport Brake Pads, Front',
                                description: 'TCarbon Fiber Infused Ceramic Brake Pads'
                            },
                            TableName: 'products',
                            ConditionExpression: 'attribute_not_exists(id)'
                        }
                    },
                    {
                        Put: {
                            Item: {
                                product_id: uuid7,
                                count: 2,
                            },
                            TableName: 'stocks',
                            ConditionExpression: 'attribute_not_exists(product_id)'
                        }
                    },

                    {
                        Put: {
                            Item: {
                                id: uuid8,
                                price: 150,
                                title: 'Michelin Pilot Sport 4 S 315/30R21',
                                description: 'Tire for performance sports cars'
                            },
                            TableName: 'products',
                            ConditionExpression: 'attribute_not_exists(id)'
                        }
                    },
                    {
                        Put: {
                            Item: {
                                product_id: uuid8,
                                count: 3,
                            },
                            TableName: 'stocks',
                            ConditionExpression: 'attribute_not_exists(product_id)'
                        }
                    }
                ]
            }
        ).promise();
        console.log('all products were successfully added');
    } catch(e) {
        console.log(e);
    }
}
truncateAndFillDbWithDefaultData();