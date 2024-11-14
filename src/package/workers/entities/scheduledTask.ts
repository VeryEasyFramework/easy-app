import { EasyEntity } from "#orm/entity/entity/entityDefinition/easyEntity.ts";
import { Choice } from "../../../../../vef-types/mod.ts";
import { EntityRecord } from "#orm/entity/entity/entityDefinition/entityDefTypes.ts";
import { dateUtils } from "#orm/utils/dateUtils.ts";
import { easyLog } from "#/log/logging.ts";

export const scheduledTask = new EasyEntity("scheduledTask");

scheduledTask.setConfig({
  label: "Scheduled Task",
  description: "Scheduled tasks to be run by the workers",
});

scheduledTask.addFields([{
  key: "taskType",
  fieldType: "ChoicesField",
  defaultValue: "entity",
  required: true,
  readOnly: true,
  choices: [{
    key: "entity",
    label: "Entity",
  }, {
    key: "settings",
    label: "Settings",
  }, {
    key: "app",
    label: "App",
  }],
}, {
  key: "recordType",
  fieldType: "DataField",
  readOnly: true,
}, {
  key: "recordId",
  fieldType: "DataField",
  readOnly: true,
}, {
  key: "recordTitle",
  fieldType: "DataField",
  readOnly: true,
}, {
  key: "action",
  fieldType: "DataField",
  readOnly: true,
}, {
  key: "taskData",
  fieldType: "JSONField",
  readOnly: true,
}, {
  key: "status",
  fieldType: "ChoicesField",
  defaultValue: "enabled",
  choices: [{ key: "enabled", label: "Enabled", color: "success" }, {
    key: "disabled",
    label: "Disabled",
    color: "muted",
  }],
}, {
  key: "title",
  fieldType: "DataField",
  readOnly: true,
}, {
  key: "scheduleType",
  fieldType: "ChoicesField",
  choices: [{ key: "recurring", label: "Recurring" }, {
    key: "once",
    label: "Once",
  }],
}, {
  key: "date",
  description: "The date to run the task for once schedule",
  fieldType: "TimeStampField",
  dependsOn: {
    field: "scheduleType",
    value: "once",
  },
}, {
  key: "schedule",
  fieldType: "ChoicesField",
  dependsOn: {
    field: "scheduleType",
    value: "recurring",
  },
  choices: [
    { key: "everyMinute", label: "Every Minute" },
    { key: "hourly", label: "Hourly" },
    { key: "daily", label: "Daily" },
    {
      key: "weekly",
      label: "Weekly",
    },
    { key: "monthly", label: "Monthly" },
  ],
}, {
  key: "onMinute",
  label: "On Minute",
  description: "The minute of the hour to run the task",
  fieldType: "IntField",
  defaultValue: 0,
  required: true,
  dependsOn: {
    field: "scheduleType",
    value: "recurring",
  },
}, {
  key: "onHour",
  label: "On Hour",
  defaultValue: 0,
  required: true,
  dependsOn: {
    field: "scheduleType",
    value: "recurring",
  },
  description: "The hour of the day to run the task",
  fieldType: "IntField",
}, {
  key: "onDay",
  label: "On Day",
  defaultValue: 1,
  required: true,
  dependsOn: {
    field: "scheduleType",
    value: "recurring",
  },
  description: "The day of the month to run the task",
  fieldType: "IntField",
}, {
  key: "onWeekday",
  label: "On Weekday",
  defaultValue: "sunday",
  required: true,
  dependsOn: {
    field: "scheduleType",
    value: "recurring",
  },
  description: "The day of the week to run the task",
  fieldType: "ChoicesField",
  choices: [
    { key: "sunday", label: "Sunday" },
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
  ],
}, {
  key: "lastRun",
  fieldType: "TimeStampField",
  readOnly: true,
}, {
  key: "nextRun",
  fieldType: "TimeStampField",
  readOnly: true,
}]);

scheduledTask.addHook("beforeSave", {
  label: "Schedule Next Run",
  description: "Set the next run time based on the schedule",
  action(task) {
    if (task.status === "disabled") {
      return;
    }
    if (task.scheduleType === "once") {
      if (task.lastRun) {
        task.status = "disabled";
        return;
      }
      task.nextRun = task.date;
      return;
    }
    const nextRun = getNextRun(task);
    if (!nextRun) {
      return;
    }
    task.nextRun = new Date(nextRun.toString());
    easyLog.info(task.nextRun, "Next Run");
  },
});

function getNextRun(task: EntityRecord): Temporal.PlainDateTime | void {
  if (!shouldSchedule(task.lastRun, task.nextRun)) {
    return;
  }
  const lastRunDT = new Date(task.lastRun || dateUtils.nowTimestamp());

  const lastRun = Temporal.PlainDateTime.from({
    hour: lastRunDT.getHours(),
    minute: lastRunDT.getMinutes(),
    day: lastRunDT.getDate(),
    month: lastRunDT.getMonth() + 1,
    year: lastRunDT.getFullYear(),
  });

  switch (task.schedule) {
    case "everyMinute":
      return lastRun.add({ minutes: 1 });
    case "hourly":
      return scheduleHourly(task, lastRun);
    case "daily":
      return scheduleDaily(task, lastRun);
    case "weekly":
      return scheduleWeekly(task, lastRun);
    case "monthly":
      return scheduleMonthly(task, lastRun);
  }
}

function scheduleHourly(
  task: EntityRecord,
  lastRunInstant: Temporal.PlainDateTime,
) {
  const onMinute = task.onMinute || 0;
  const newInstant = Temporal.PlainDateTime.from({
    hour: lastRunInstant.hour,
    minute: onMinute,
    day: lastRunInstant.day,
    month: lastRunInstant.month,
    year: lastRunInstant.year,
  });
  return newInstant.add({ hours: 1 });
}

function scheduleDaily(
  task: EntityRecord,
  lastRunInstant: Temporal.PlainDateTime,
) {
  const onHour = task.onHour || 0;
  const onMinute = task.onMinute || 0;
}

function scheduleWeekly(
  task: EntityRecord,
  lastRunInstant: Temporal.PlainDateTime,
) {
  const onWeekday = task.onWeekday;
  const onHour = task.onHour || 0;
  const onMinute = task.onMinute || 0;
}

function scheduleMonthly(
  task: EntityRecord,
  lastRunInstant: Temporal.PlainDateTime,
) {
  const onDay = task.onDay || 1;
  const onHour = task.onHour || 0;
  const onMinute = task.onMinute || 0;
}
function shouldSchedule(
  lastRun: number | null | undefined,
  nextRun: number | null | undefined,
): boolean {
  return true;
  // if (nextRun && lastRun) {
  //   return nextRun < lastRun;
  // }
  // if (!lastRun && nextRun) {
  //   return false;
  // }
  // return true;
}
