
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  telegramId: 'telegramId',
  role: 'role',
  name: 'name',
  royaltyCut: 'royaltyCut',
  totalEarned: 'totalEarned',
  xpTotal: 'xpTotal',
  level: 'level',
  streakDays: 'streakDays',
  lastActiveAt: 'lastActiveAt',
  createdAt: 'createdAt'
};

exports.Prisma.TaskScalarFieldEnum = {
  id: 'id',
  day: 'day',
  text: 'text',
  done: 'done',
  completedAt: 'completedAt',
  proofFileId: 'proofFileId',
  proofType: 'proofType',
  ownerId: 'ownerId',
  type: 'type',
  assignedById: 'assignedById',
  assignedAt: 'assignedAt',
  rating: 'rating',
  ratingComment: 'ratingComment',
  createdAt: 'createdAt'
};

exports.Prisma.TaskSkillTagScalarFieldEnum = {
  id: 'id',
  taskId: 'taskId',
  skillId: 'skillId'
};

exports.Prisma.SkillCategoryScalarFieldEnum = {
  id: 'id',
  slug: 'slug',
  name: 'name',
  icon: 'icon',
  sortOrder: 'sortOrder'
};

exports.Prisma.SkillScalarFieldEnum = {
  id: 'id',
  slug: 'slug',
  name: 'name',
  description: 'description',
  tier: 'tier',
  categoryId: 'categoryId'
};

exports.Prisma.UserSkillScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  skillId: 'skillId',
  selected: 'selected',
  initialLevel: 'initialLevel',
  currentLevel: 'currentLevel',
  xp: 'xp',
  startedAt: 'startedAt',
  lastPracticedAt: 'lastPracticedAt'
};

exports.Prisma.SkillTaskScalarFieldEnum = {
  id: 'id',
  day: 'day',
  text: 'text',
  description: 'description',
  aiHint: 'aiHint',
  targetRole: 'targetRole',
  skillId: 'skillId',
  xpReward: 'xpReward',
  done: 'done',
  completedAt: 'completedAt',
  ownerId: 'ownerId'
};

exports.Prisma.ResourceScalarFieldEnum = {
  id: 'id',
  type: 'type',
  name: 'name',
  url: 'url',
  description: 'description',
  thumbnailUrl: 'thumbnailUrl',
  targetRole: 'targetRole',
  skillId: 'skillId',
  priority: 'priority'
};

exports.Prisma.UserResourceScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  resourceId: 'resourceId',
  status: 'status',
  completedAt: 'completedAt',
  notes: 'notes'
};

exports.Prisma.ContactScalarFieldEnum = {
  id: 'id',
  name: 'name',
  phone: 'phone',
  email: 'email',
  company: 'company',
  contactRole: 'contactRole',
  category: 'category',
  description: 'description',
  notes: 'notes',
  tags: 'tags',
  status: 'status',
  progressPct: 'progressPct',
  notionId: 'notionId',
  nextActionDate: 'nextActionDate',
  lastContactAt: 'lastContactAt',
  createdById: 'createdById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChatMessageScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  msgRole: 'msgRole',
  content: 'content',
  context: 'context',
  tokensUsed: 'tokensUsed',
  sessionId: 'sessionId',
  createdAt: 'createdAt'
};

exports.Prisma.PenaltyScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  description: 'description',
  xpPenalty: 'xpPenalty',
  day: 'day',
  acknowledged: 'acknowledged',
  createdAt: 'createdAt'
};

exports.Prisma.AchievementScalarFieldEnum = {
  id: 'id',
  slug: 'slug',
  name: 'name',
  description: 'description',
  icon: 'icon',
  xpReward: 'xpReward',
  condition: 'condition'
};

exports.Prisma.UserAchievementScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  achievementId: 'achievementId',
  earnedAt: 'earnedAt'
};

exports.Prisma.MilestoneScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  targetDay: 'targetDay',
  milestoneType: 'milestoneType',
  targetRole: 'targetRole',
  achieved: 'achieved',
  achievedAt: 'achievedAt',
  metrics: 'metrics'
};

exports.Prisma.DailyReportScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  day: 'day',
  primaryDone: 'primaryDone',
  assignedDone: 'assignedDone',
  skillDone: 'skillDone',
  xpEarned: 'xpEarned',
  xpLost: 'xpLost',
  mood: 'mood',
  blockers: 'blockers',
  wins: 'wins',
  createdAt: 'createdAt'
};

exports.Prisma.SettingsScalarFieldEnum = {
  key: 'key',
  value: 'value',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  User: 'User',
  Task: 'Task',
  TaskSkillTag: 'TaskSkillTag',
  SkillCategory: 'SkillCategory',
  Skill: 'Skill',
  UserSkill: 'UserSkill',
  SkillTask: 'SkillTask',
  Resource: 'Resource',
  UserResource: 'UserResource',
  Contact: 'Contact',
  ChatMessage: 'ChatMessage',
  Penalty: 'Penalty',
  Achievement: 'Achievement',
  UserAchievement: 'UserAchievement',
  Milestone: 'Milestone',
  DailyReport: 'DailyReport',
  Settings: 'Settings'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
