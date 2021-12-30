import webTokens from "design-tokens/dist/web/tokens.json";
import nativeTokens from "design-tokens/dist/native/tokens.json";

import {
  COLOR_BASE_GRAY_MEDIUM,
  FONT_FAMILY_SYSTEM,
} from "design-tokens/dist/web/tokens";
import { useState } from "react";

const TokenDisplay = ({ token, onTokenUpdate }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      fontFamily: FONT_FAMILY_SYSTEM,
    }}
  >
    {token.name} -{" "}
    <input
      type="text"
      defaultValue={token.value}
      onBlur={(evt) => onTokenUpdate(token.name, evt.target.value)}
    />{" "}
    <div
      style={{
        display: "inline-block",
        borderRadius: "50%",
        marginLeft: 5,
        width: 25,
        height: 25,
        background: token.value,
      }}
    ></div>
  </div>
);

export default function Web() {
  const [webTokenValues, setWebValues] = useState(webTokens);
  const [nativeTokenValues, setNativeValues] = useState(nativeTokens);

  async function sendToken(token) {
    const res = await fetch("/api/tokens", {
      method: "POST",
      body: JSON.stringify(token),
    });
    await res.json();
  }

  function onUpdateToken(type: "web" | "native") {
    return (name: string, value: string) => {
      switch (type) {
        case "web": {
          const updated = webTokenValues.find((token) => {
            return token.name === name
          })
          updated.value = value
          sendToken(updated);
          break;
        }
        case "native": {
          const updated = nativeTokenValues.find((token) => {
            return token.name === name
          });
          updated.value = value
          sendToken(updated);
          break;
        }
      }
    };
  }

  return (
    <>
      <div>
        <h1
          style={{
            color: COLOR_BASE_GRAY_MEDIUM,
            fontFamily: FONT_FAMILY_SYSTEM,
          }}
        >
          Web Design Tokens
        </h1>
        {webTokenValues.map((token) => (
          <TokenDisplay token={token} onTokenUpdate={onUpdateToken("web")} />
        ))}
      </div>
      <div>
        <h1
          style={{
            color: COLOR_BASE_GRAY_MEDIUM,
            fontFamily: FONT_FAMILY_SYSTEM,
          }}
        >
          Native Design Tokens
        </h1>
        {nativeTokenValues.map((token) => (
          <TokenDisplay token={token} onTokenUpdate={onUpdateToken("native")} />
        ))}
      </div>
    </>
  );
}
