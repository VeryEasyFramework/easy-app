import { EasyApp } from "../mod.ts";
import { createAction } from "#/createAction.ts";

const someAction = createAction("someAction", {
  description: "This is a description of the action",
  action: async (app, data) => {
    return { message: "Hello World!", id: data.id };
  },
  params: {
    id: {
      required: true,
      type: "string",
    },
  },
});

const checkLink = createAction("checkLink", {
  description: "Check the redirects of a link",
  action: async (app, { link }) => {
    const response = await fetch(link, { redirect: "manual" });
    return {
      status: response.status,
      headers: response.headers,
      url: response.url,
    };
  },
  params: {
    link: {
      required: true,
      type: "string",
    },
  },
});

const app = new EasyApp({
  appRootPath: "dev",
  staticFileRoot: "public",
});

app.addAction("something", someAction);
app.addAction("utils", checkLink);
app.run();
