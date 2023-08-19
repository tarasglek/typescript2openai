import * as acorn from "acorn";
import {tsPlugin} from "acorn-typescript";

export function parseTypescript(code: string) {
    const ast = acorn.Parser.extend(tsPlugin() as any).parse(code, {
      sourceType: "module",
      ecmaVersion: "latest",
    });

    function walk(anode: acorn.Node, callback: any, depth = 0) {
      callback(anode, depth);
      const node = anode as any;
      for (const key in node) {
        if (node[key] && typeof node[key] === "object") {
          walk(node[key], callback, depth + 1);
        }
      }
    }

    walk(ast, (node: acorn.Node, depth: number) => {
      const spaces = " ".repeat(depth);
      switch (node.type) {
        case "FunctionDeclaration":
        //   console.log(spaces + "FunctionDeclaration", node);
          console.log(`${spaces}Function: ${node.id.name}`);
          node.params.forEach((param: any) => {
            console.log(`${spaces}  Param: ${param.name}`);
            if (param.typeAnnotation) {
              console.log(`${spaces}    Type: ${param.typeAnnotation.typeAnnotation.type}`);
            }
          });
          if (node.leadingComments) {
            console.log(`${spaces}  Doc: ${node.leadingComments[0].value.trim()}`);
          }
          break;
        default:
        //   console.log(spaces, JSON.stringify(node.type));
      }
    });
  }
