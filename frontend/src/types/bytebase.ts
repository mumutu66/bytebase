import { ResourceObject } from "./jsonapi";
import { BBNotificationStyle } from "../bbkit/types";
import { TaskFieldId } from "../plugins";

// These ID format may change in the future, so we encapsulate with a type.
// Also good for readability.
export type UserId = string;

export type StageId = string;

export type TaskId = string;

export type ActivityId = string;

export type GroupId = string;

export type ProjectId = string;

export type EnvironmentId = string;

export type InstanceId = string;

export type DataSourceId = {
  id: string;
  instanceId: InstanceId;
};

export type CommandId = string;
export type CommandRegisterId = string;

// Persistent State Models
// User
export type User = ResourceObject & {
  attributes: {
    name: string;
  };
};
export type NewUser = Omit<User, "id">;

// For display purpose
export type UserDisplay = {
  id: UserId;
  name: string;
};

// Bookmark
export type Bookmark = ResourceObject & {};
export type NewBookmark = Omit<Bookmark, "id">;

// Stage
export type StageType = "SIMPLE" | "ENVIRONMENT";

export type StageStatus = "PENDING" | "RUNNING" | "DONE" | "FAILED" | "SKIPPED";

export type StageRunnable = {
  auto: boolean;
  run: () => void;
};

export type Stage = {
  id: StageId;
  name: string;
  type: StageType;
  environmentId?: EnvironmentId;
  runnable?: StageRunnable;
};

export type StageProgress = Stage & {
  status: StageStatus;
};

export type StageProgressPatch = {
  id: StageId;
  status: StageStatus;
};

// Task
type TaskTypeGeneral = "bytebase.general";

type TaskTypeDataSource =
  | "bytebase.datasource.create"
  | "bytebase.datasource.schema.update";

export type TaskType = TaskTypeGeneral | TaskTypeDataSource;

export type TaskStatus = "OPEN" | "DONE" | "CANCELED";

export type TaskPayload = { [key: string]: any };

export type Task = ResourceObject & {
  attributes: {
    name: string;
    createdTs: number;
    lastUpdatedTs: number;
    status: TaskStatus;
    category: "DDL" | "DML" | "OPS";
    type: TaskType;
    description: string;
    stageProgressList: StageProgress[];
    creator: UserDisplay;
    assignee?: UserDisplay;
    subscriberIdList: Array<string>;
    payload: TaskPayload;
  };
};

export type TaskNew = Omit<ResourceObject, "id"> & {
  attributes: {
    name: string;
    type: TaskType;
    description: string;
    stageProgressList: StageProgress[];
    creator: UserDisplay;
    assignee?: UserDisplay;
    payload: TaskPayload;
  };
};

export type TaskPatch = {
  name?: string;
  status?: TaskStatus;
  description?: string;
  assignee?: UserDisplay;
  stageProgressList?: StageProgressPatch[];
  payload?: TaskPayload;
};

// Activity
export type TaskActionType =
  | "bytebase.task.create"
  | "bytebase.task.comment.create"
  | "bytebase.task.field.update";

export type ActionType = TaskActionType;

export type ActionTaskCommentCreatePayload = {
  comment: string;
};

export type ActionTaskFieldUpdatePayload = {
  changeList: {
    fieldId: TaskFieldId;
    oldValue?: string;
    newValue?: string;
  }[];
};

export type ActionPayloadType =
  | ActionTaskCommentCreatePayload
  | ActionTaskFieldUpdatePayload;

export type Activity = ResourceObject & {
  attributes: {
    createdTs: number;
    lastUpdatedTs: number;
    actionType: ActionType;
    // The object where this activity belongs
    // e.g if actionType is "bytebase.task.xxx", then this field refers to the corresponding task's id.
    containerId: TaskId;
    creator: UserDisplay;
    payload?: ActionPayloadType;
  };
};
export type ActivityNew = Omit<Activity, "id">;

export type ActivityPatch = {
  payload: any;
};

// Environment
export type Environment = ResourceObject & {
  attributes: {
    name: string;
    order: number;
  };
};
export type EnvironmentNew = Omit<Environment, "id">;

// Instance
export type Instance = ResourceObject & {
  attributes: {
    name: string;
    environmentId: string;
    externalLink?: string;
    host: string;
    port?: string;
  };
};
export type InstanceNew = Omit<Instance, "id">;

// Data Source
export type DataSource = ResourceObject & {
  attributes: {
    name: string;
    type: "ADMIN" | "NORMAL";
    // In mysql, username can be empty which means anonymous user
    username?: string;
    password?: string;
  };
};
export type DataSourceNew = Omit<DataSource, "id">;

// Group
export type Group = ResourceObject & {};
export type GroupNew = Omit<Group, "id">;

// Project
export type Project = ResourceObject & {};
export type ProjectNew = Omit<Project, "id">;

// Repository
export type Repository = ResourceObject & {};
export type RepositoryNew = Omit<Repository, "id">;

// Auth
export type LoginInfo = Omit<
  ResourceObject & {
    attributes: {
      username: string;
      password: string;
    };
  },
  "id"
>;

export type SignupInfo = Omit<
  ResourceObject & {
    attributes: {
      username: string;
      password: string;
    };
  },
  "id"
>;

// UI State Models
export type RouterSlug = {
  taskSlug?: string;
  instanceSlug?: string;
};

export type Notification = {
  id: string;
  createdTs: number;
  module: string;
  style: BBNotificationStyle;
  title: string;
  description?: string;
};

export type Command = {
  id: CommandId;
  registerId: CommandRegisterId;
  run: () => void;
};

// "id" and "createdTs" is auto generated upon the notification store
// receives.
export type NewNotification = Omit<Notification, "id" | "createdTs">;

export type NotificationFilter = {
  module: string;
};

// Store
export interface AuthState {
  currentUser: User | null;
}

export interface BookmarkState {
  bookmarkListByUser: Map<UserId, Bookmark[]>;
}

export interface ActivityState {
  activityListByUser: Map<UserId, Activity[]>;
  activityListByTask: Map<TaskId, Activity[]>;
}

export interface TaskState {
  taskListByUser: Map<UserId, Task[]>;
  taskById: Map<TaskId, Task>;
}

export interface GroupState {
  groupListByUser: Map<UserId, Group[]>;
}

export interface ProjectState {
  projectListByGroup: Map<GroupId, Project[]>;
  projectListByUser: Map<UserId, Project[]>;
}

export interface EnvironmentState {
  environmentList: Environment[];
}

export interface InstanceState {
  instanceList: Instance[];
  instanceById: Map<InstanceId, Instance>;
}

export interface DataSourceState {
  dataSourceListByInstanceId: Map<InstanceId, DataSource[]>;
  dataSourceById: Map<DataSourceId, DataSource>;
}

export interface RepositoryState {
  repositoryByProject: Map<ProjectId, Repository>;
}

export interface NotificationState {
  notificationByModule: Map<string, Notification[]>;
}

export interface CommandState {
  commandListById: Map<CommandId, Command[]>;
}
