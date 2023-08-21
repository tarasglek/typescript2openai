This is a utility to convert TypeScript/JavaScript function signatures with jsdoc comments to OpenAI function [spec](https://platform.openai.com/docs/api-reference/chat/create#chat/create-functions).

## Usage
```typescript
import { parseTypeScript } from "typescript2openai";
parseTypeScript("function funcWithArrayAndOptionalParam(firstParam: string[], optional?: number) {}");
```

Go from this:

```typescript
/**
 * Example of a function that takes an array and has an optional parameter
 * @param Marvel at how verbose these are to write manually
 * @param optional This one does not show up in required
 */
function funcWithArrayAndOptionalParam(firstParam: string[], optional?: number) {
}
```

to

```json
{
  "name": "funcWithArrayAndOptionalParam",
  "description": "Example of a function that takes an array and has an optional parameter",
  "parameters": {
      "type": "object",
      "properties": {
          "firstParam": {
              "type": {
                  "type": "array",
                  "items": {
                      "type": "string"
                  }
              }
          },
          "optional": {
              "type": "number",
              "description": "This one does not show up in required"
          }
      },
      "required": [
          "firstParam"
      ]
  }
}
```

See the unit test for examples of conversions and usage: [basic.test.ts](./src/test/basic.test.ts)

See also:
- https://github.dev/vega/ts-json-schema-generator/
