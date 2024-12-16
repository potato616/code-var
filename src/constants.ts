import { getPreferenceValues } from "@raycast/api";
import type { Preferences } from "./types";

export const PREFERENCES = getPreferenceValues<Preferences>();

export const CODE_VAR_HISTORY = "CODE_VAR_HISTORY";

export const CASES = [
  "noCase", // 普通格式：hello world
  "camelCase", // 驼峰格式：helloWorld
  "pascalCase", // 帕斯卡格式：HelloWorld
  "constantCase", // 常量格式：HELLO_WORLD
  "sentenceCase", // 句子格式：Hello world
  "dotCase", // 点分格式：hello.world
  "headerCase", // 标题格式：Hello-World
  "paramCase", // 参数格式：hello-world
  "pathCase", // 路径格式：hello/world
  "snakeCase", // 蛇形格式：hello_world 
] as const;

export const IGNORE_WORDS = ["and", "or", "the", "a", "at", "of", "was", "an"];
