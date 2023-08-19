```bash
#> pnpm tsx index.tsx parser.ts
  Function: jsonSchemaTypeFromKeyword
{
  "functionName": "jsonSchemaTypeFromKeyword",
  "description": "* Converts a typescript keyword to a JSON schema type",
  "params": {
    "properties": {
      "value": {
        "type": "string",
        "description": "The typescript keyword"
      }
    },
    "required": [
      "value"
    ]
  }
}
  Function: generateJsonSchema
{
  "functionName": "generateJsonSchema",
  "description": "* Converts a typescript keyword to a JSON schema type",
  "params": {
    "properties": {
      "node": {
        "type": "any",
        "description": "The AST node for the function"
      },
      "paramDescriptions": {
        "type": "any",
        "description": "The descriptions for each parameter"
      }
    },
    "required": [
      "node",
      "paramDescriptions"
    ]
  }
}
  Function: parseJSDoc
{
  "functionName": "parseJSDoc",
  "description": "* Converts a typescript keyword to a JSON schema type",
  "params": {
    "properties": {
      "jsdoc": {
        "type": "string",
        "description": "The JSDoc comment to parse"
      }
    },
    "required": [
      "jsdoc"
    ]
  }
}
   Function: parseTypescript
{
  "functionName": "parseTypescript",
  "description": "",
  "params": {
    "properties": {
      "code": {
        "type": "string"
      }
    },
    "required": [
      "code"
    ]
  }
}
```