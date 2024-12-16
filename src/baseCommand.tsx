import React from "react";
import { Action, ActionPanel, List, Icon, Clipboard, showToast, Toast, getSelectedText } from "@raycast/api";
import * as changeCase from "change-case";

import { queryVariableNames } from "./useQuery";

type CaseType = keyof typeof changeCase;

type CommandProps = {
  caseType: CaseType;
  title: string;
};

export default function BaseCommand({ caseType, title }: CommandProps) {
  const cancelRef = React.useRef<AbortController | null>(null);
  const [variableName, setVariableName] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const selectedText = (await getSelectedText().catch(() => ""))?.trim?.();
      if (selectedText) {
        onSearchTextChange(selectedText);
      }
    })();
    return () => {
      cancelRef.current?.abort();
    };
  }, []);

  async function onSearchTextChange(text: string) {
    cancelRef.current?.abort();
    const searchContent = text.trim();
    if (!searchContent) {
      setVariableName("");
      return;
    }

    cancelRef.current = new AbortController();
    try {
      setLoading(true);
      const results = await queryVariableNames(searchContent, cancelRef.current.signal);
      const words = results[0].value.replace(/\n/g, "").replace(/\./g, "").trim().split(" ").join(" ");

      setVariableName(changeCase[caseType](words));
      setLoading(false);
    } catch (error: unknown) {
      if (!String(error).startsWith("AbortError")) {
        showToast({
          style: Toast.Style.Failure,
          title: "Error",
          message: String(error) || (error as Error)?.message,
        });
      }
      setVariableName("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <List
      isLoading={loading}
      onSearchTextChange={onSearchTextChange}
      searchBarPlaceholder={`Enter text to convert to ${title}`}
      throttle
    >
      {variableName && (
        <List.Item
          title={variableName}
          icon={Icon.Stars}
          actions={
            <ActionPanel>
              <ActionPanel.Section>
                <Action.CopyToClipboard title="Copy to Clipboard" content={variableName} />
                <Action
                  title="Copy and Paste"
                  onAction={() => Clipboard.paste(variableName)}
                  icon={{ source: Icon.CopyClipboard }}
                />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      )}
    </List>
  );
}
