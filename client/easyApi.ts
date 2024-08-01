interface ErrorInfo {
  statusCode: number;
  message: string;
  title?: string;
}
export interface APIGroupCommand {
  description: string;
  response: any;

  params: {
    [key: string]: {
      type: keyof FieldTypes;
      required: boolean;
      value?: any;
    };
  };
}

export interface APIGroup {
  name: string;
  commands: {
    [key: string]: APIGroupCommand;
  };
}

interface IRLRouteCommand {
  response: any;
  params: KVRecord<any>;
}

type KVRecord<T> = {
  [P in keyof T]: T[P];
};
type TIRLRouteCommand<T extends TIRLRouteCommand<T>> = {
  response: T["response"];

  params: KVRecord<T["params"]>;
};

interface RSType {
  /**
   * Groups
   */
  [key: string]: {
    /**
     * Commands
     */
    [key: string]: IRLRouteCommand;
  };
}

export type RequestStructure<R extends RSType> = {
  /**
   * Groups
   */
  [K in keyof R]: {
    /**
     * Commands
     */
    [C in keyof R[K]]: TIRLRouteCommand<R[K][C]>;
  };
};
export class EasyApi {
  host: string;

  constructor(host: string) {
    this.host = host;
  }

  async call<T>(
    group: string,
    action: string,
    data?: Record<string, any>,
  ): Promise<T> {
    const url = `${this.host}?group=${group as string}&action=${action}`;
    const response = await fetch(url, {
      method: "POST",
      // credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).catch((e) => {
      this.notify({
        message: e.message,
        title: "Network Error",
        type: "error",
      });
      return new Response(null, { status: 500 });
    });
    if (!response.ok) {
      if (response.status === 302) {
        window.location.href = response.headers.get("Location") || "/";
      }

      const content = await response.text();
      const info = this.parseError(response, content);
      const title = `${info.title || "API Error"} - ${info.statusCode}`;
      if (
        group === "auth" && action === "check" && info.statusCode === 401
      ) {
        return {} as T;
      }
      this.notify({
        message: info.message,
        title: title,
        type: "error",
      });
      return {} as T;
    }
    const responseContent = await response.json();

    return responseContent;
  }
  private parseError(response: Response, errorContent: string) {
    const info = {} as ErrorInfo;
    info.statusCode = response.status;
    let content: any;
    try {
      content = JSON.parse(errorContent ?? "");
      info.message = content;
    } catch (_e) {
      content = errorContent;
    }
    info.message = content;
    return info;
  }

  private notify(info: { message: string; title: string; type: string }): void {
    console.error(info);
  }
}
