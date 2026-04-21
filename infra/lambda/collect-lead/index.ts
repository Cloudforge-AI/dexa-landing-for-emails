import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE_NAME = process.env.TABLE_NAME!;

export const handler = async (event: any) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { email, name, type } = body;

    // Validate
    if (!email || !name || !type) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Campos requeridos: email, name, type' }) };
    }
    if (!['dentist', 'patient'].includes(type)) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Tipo debe ser "dentist" o "patient"' }) };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: 'Email invalido' }) };
    }

    // Save (prevent duplicates via condition)
    await client.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        type,
        createdAt: new Date().toISOString(),
        source: 'landing-page',
      },
      ConditionExpression: 'attribute_not_exists(email)',
    }));

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: '¡Registro exitoso!' }) };
  } catch (err: any) {
    if (err.name === 'ConditionalCheckFailedException') {
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, message: '¡Ya estas registrado!' }) };
    }
    console.error('Error:', err);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: 'Error interno' }) };
  }
};
