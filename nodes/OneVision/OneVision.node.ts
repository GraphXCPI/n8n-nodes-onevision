import {
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	GenericValue,
	NodeOperationError,
	NodeConnectionTypes,
} from 'n8n-workflow';

export class OneVision implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OneVision',
		name: 'oneVision',
		icon: { light: 'file:OneVision.svg', dark: 'file:OneVision.dark.svg' },
		group: ['transform'],
		version: [1, 2, 3, 10],
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with OneVision Workspace Server REST API',
		defaults: {
			name: 'OneVision',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'oneVisionApi',
				required: true,
			},
		],
		properties: [
			// ============================================
			// RESOURCE SELECTOR
			// ============================================
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'API Request',
						value: 'apiRequest',
						description: 'Make an authenticated request to a OneVision REST endpoint',
					},
					{
						name: 'Assembly Line',
						value: 'assemblyLine',
						description: 'Manage assembly lines',
					},
					{
						name: 'Authentication',
						value: 'authentication',
						description: 'Login, logout, and health check',
					},
					{
						name: 'JMF',
						value: 'jmf',
						description: 'Job Messaging Format operations',
					},
					{
						name: 'Job',
						value: 'job',
						description: 'Manage existing jobs',
					},
					{
						name: 'Job Start',
						value: 'jobStart',
						description: 'Start new jobs',
					},
					{
						name: 'Module',
						value: 'module',
						description: 'Module operations',
					},
					{
						name: 'Statistic',
						value: 'statistics',
						description: 'Current and historical statistics',
					},
					{
						name: 'Storage',
						value: 'storage',
						description: 'File and folder management',
					},
					{
						name: 'Substrate',
						value: 'substrate',
						description: 'Query substrate resources',
					},
					{
						name: 'System',
						value: 'system',
						description: 'System information and settings',
					},
				],
				default: 'job',
			},

			// ============================================
			// API REQUEST OPERATION
			// ============================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['apiRequest'],
					},
				},
				options: [
					{
						name: 'Make Request',
						value: 'make',
						description: 'Make an authenticated request under /ws/rest',
						action: 'Make an API request',
					},
				],
				default: 'make',
			},
			{
				displayName: 'Method',
				name: 'apiRequestMethod',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['apiRequest'],
						operation: ['make'],
					},
				},
				options: [
					{ name: 'DELETE', value: 'DELETE' },
					{ name: 'GET', value: 'GET' },
					{ name: 'PATCH', value: 'PATCH' },
					{ name: 'POST', value: 'POST' },
					{ name: 'PUT', value: 'PUT' },
				],
				default: 'GET',
				description: 'HTTP method to use',
			},
			{
				displayName: 'Path',
				name: 'apiRequestPath',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['apiRequest'],
						operation: ['make'],
					},
				},
				default: '/system/version',
				description: 'Path under /ws/rest, for example /system/version or /job',
			},
			{
				displayName: 'Query Parameters',
				name: 'apiRequestQuery',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['apiRequest'],
						operation: ['make'],
					},
				},
				default: '{}',
				description: 'Query parameters as JSON',
			},
			{
				displayName: 'Request Body',
				name: 'apiRequestBody',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['apiRequest'],
						operation: ['make'],
					},
				},
				default: '{}',
				description: 'Request body as JSON. Leave as {} for requests without a body.',
			},

			// ============================================
			// ASSEMBLY LINE OPERATIONS
			// ============================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['assemblyLine'],
					},
				},
				options: [
					{
						name: 'Activate',
						value: 'activate',
						description: 'Activate an assembly line with PUT /assemblyline/activate',
						action: 'Activate assembly line',
					},
					{
						name: 'Activate (GET)',
						value: 'activateGet',
						description: 'Activate an assembly line with GET /assemblyline/activate for API compatibility',
						action: 'Activate assembly line via GET',
					},
					{
						name: 'Deactivate',
						value: 'deactivate',
						description: 'Deactivate an assembly line with PUT /assemblyline/deactivate',
						action: 'Deactivate assembly line',
					},
					{
						name: 'Deactivate (GET)',
						value: 'deactivateGet',
						description: 'Deactivate an assembly line with GET /assemblyline/deactivate for API compatibility',
						action: 'Deactivate assembly line via GET',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many assembly lines',
						action: 'Get many assembly lines',
					},
					{
						name: 'Get XML',
						value: 'getXml',
						description: 'Get assembly line XML configuration',
						action: 'Get assembly line XML',
					},
				],
				default: 'getAll',
			},
			// Assembly Line: Name (for activate/deactivate)
			{
				displayName: 'Assembly Line Name',
				name: 'assemblyLine',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['assemblyLine'],
						operation: ['activate', 'activateGet', 'deactivate', 'deactivateGet'],
					},
				},
				default: '',
				description: 'Name of the assembly line to activate or deactivate',
			},
			// Assembly Line: ID (for getXml)
			{
				displayName: 'Assembly Line ID',
				name: 'assemblyLineId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['assemblyLine'],
						operation: ['getXml'],
					},
				},
				default: '',
				description: 'ID of the assembly line to retrieve XML for',
			},
			{
				displayName: 'Status',
				name: 'assemblyLineStatus',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['assemblyLine'],
						operation: ['getAll'],
					},
				},
				options: [
					{ name: 'Active', value: 'ACTIVE' },
					{ name: 'All', value: '' },
					{ name: 'Defect', value: 'DEFECT' },
					{ name: 'Inactive', value: 'INACTIVE' },
					{ name: 'Interrupted', value: 'INTERRUPTED' },
				],
				default: '',
				description: 'Optional state filter for assembly lines',
			},
			{
				displayName: 'Module Type',
				name: 'moduleType',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['assemblyLine'],
						operation: ['getAll'],
					},
				},
				default: '',
				description: 'Optional internal module type filter',
			},
			{
				displayName: 'Start Mark Type',
				name: 'startMarkType',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['assemblyLine'],
						operation: ['getAll'],
					},
				},
				default: '',
				description: 'Optional internal start mark type filter',
			},
			{
				displayName: 'Max Results',
				name: 'maxResults',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['assemblyLine'],
						operation: ['getAll'],
					},
				},
				default: 0,
				description: 'Maximum number of assembly lines to return. Use 0 for all results.',
			},

			// ============================================
			// AUTHENTICATION OPERATIONS
			// ============================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['authentication'],
					},
				},
				options: [
					{
						name: 'Alive',
						value: 'alive',
						description: 'Check if service is alive',
						action: 'Check service health',
					},
					{
						name: 'Login',
						value: 'login',
						description: 'Login to OneVision Workspace',
						action: 'Login to workspace',
					},
					{
						name: 'Logout',
						value: 'logout',
						description: 'Logout from OneVision Workspace',
						action: 'Logout from workspace',
					},
				],
				default: 'alive',
			},
			// Authentication: User ID
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['authentication'],
						operation: ['alive', 'logout'],
					},
				},
				default: '',
				description: 'OneVision user ID for alive/logout requests',
			},
			// Authentication: Username
			{
				displayName: 'Username',
				name: 'username',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['authentication'],
						operation: ['login'],
					},
				},
				default: '',
				description: 'Username for login',
			},
			// Authentication: Password
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: {
					password: true,
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['authentication'],
						operation: ['login'],
					},
				},
				default: '',
				description: 'Password for login',
			},
			{
				displayName: 'Crypt',
				name: 'crypt',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['authentication'],
						operation: ['login'],
					},
				},
				options: [
					{ name: 'Default', value: '' },
					{ name: 'None', value: 'NONE' },
				],
				default: '',
				description: 'Optional password encryption mode. NONE should only be used over HTTPS or for testing.',
			},
			{
				displayName: 'Crypt Param',
				name: 'cryptParam',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['authentication'],
						operation: ['login'],
					},
				},
				default: '',
				description: 'Optional crypt parameter such as a base64 initialization vector',
			},
			{
				displayName: 'Mandatory User Rights',
				name: 'mandatoryUserRights',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['authentication'],
						operation: ['login'],
					},
				},
				default: '',
				description: 'Optional space-separated user rights that must be present for login to succeed',
			},
			{
				displayName: 'Optional User Rights',
				name: 'optionalUserRights',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['authentication'],
						operation: ['login'],
					},
				},
				default: '',
				description: 'Optional space-separated user rights to report as present or missing',
			},
			{
				displayName: 'Application Name',
				name: 'applicationName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['authentication'],
						operation: ['login'],
					},
				},
				default: '',
				description: 'Optional application name for the login request',
			},

			// ============================================
			// JMF OPERATIONS
			// ============================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['jmf'],
					},
				},
				options: [
					{
						name: 'Send to Assembly Line',
						value: 'sendToAssemblyLine',
						description: 'Send JMF to an assembly line with POST /jmf/al',
						action: 'Send JMF to assembly line',
					},
					{
						name: 'Send to Assembly Line (PUT)',
						value: 'sendToAssemblyLinePut',
						description: 'Send JMF to an assembly line with PUT /jmf/al',
						action: 'Send JMF to assembly line via PUT',
					},
					{
						name: 'Send to Machine',
						value: 'sendToMachine',
						description: 'Send JMF to a specific machine with POST /jmf/device/{deviceName}/{machineName}',
						action: 'Send JMF to machine',
					},
					{
						name: 'Send to Machine (PUT)',
						value: 'sendToMachinePut',
						description: 'Send JMF to a specific machine with PUT /jmf/device/{deviceName}/{machineName}',
						action: 'Send JMF to machine via PUT',
					},
				],
				default: 'sendToAssemblyLine',
			},
			// JMF: Assembly Line Name
			{
				displayName: 'Assembly Line',
				name: 'assemblyLine',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['jmf'],
						operation: ['sendToAssemblyLine', 'sendToAssemblyLinePut'],
					},
				},
				default: '',
				description: 'Assembly line to send JMF to',
			},
			// JMF: Device Name
			{
				displayName: 'Device Name',
				name: 'deviceName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['jmf'],
						operation: ['sendToMachine', 'sendToMachinePut'],
					},
				},
				default: '',
			},
			// JMF: Machine Name
			{
				displayName: 'Machine Name',
				name: 'machineName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['jmf'],
						operation: ['sendToMachine', 'sendToMachinePut'],
					},
				},
				default: '',
			},
			// JMF: XML Content
			{
				displayName: 'JMF XML',
				name: 'jmfXml',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['jmf'],
					},
				},
				default: '',
				description: 'JMF XML content to send',
			},

			// ============================================
			// JOB OPERATIONS
			// ============================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['job'],
					},
				},
				options: [
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a job',
						action: 'Delete a job',
					},
					{
						name: 'Get Files',
						value: 'getFiles',
						description: 'Get job files',
						action: 'Get job files',
					},
					{
						name: 'Get Log',
						value: 'getLog',
						description: 'Get job processing log',
						action: 'Get job log',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many jobs',
						action: 'Get many jobs',
					},
					{
						name: 'Get Overview',
						value: 'getOverview',
						description: 'Get job overview',
						action: 'Get job overview',
					},
					{
						name: 'Resume Actions',
						value: 'resumeActions',
						description: 'Resume job actions',
						action: 'Resume job actions',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update job information',
						action: 'Update a job',
					},
				],
				default: 'getOverview',
			},
			// Job: Job ID (required for all single-job operations)
			{
				displayName: 'Job ID',
				name: 'jobId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['delete', 'getFiles', 'getLog', 'getOverview', 'resumeActions', 'update'],
					},
				},
				default: '',
				description: 'The ID of the job',
			},
			// Job: Files filter
			{
				displayName: 'File Filter',
				name: 'jobFileFilter',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['getFiles'],
					},
				},
				options: [
					{ name: 'Cleanup Error Files', value: 'GatherResults:CLEANUP:ERROR_FILES' },
					{ name: 'Cleanup OK Files', value: 'GatherResults:CLEANUP:OK_FILES' },
					{ name: 'Cleanup Results', value: 'GatherResults:CLEANUP' },
					{ name: 'Main Error Files', value: 'GatherResults:MAIN:ERROR_FILES' },
					{ name: 'Main OK Files', value: 'GatherResults:MAIN:OK_FILES' },
					{ name: 'Main Results', value: 'GatherResults:MAIN' },
					{ name: 'Postprocessing Error Files', value: 'GatherResults:POSTPROCESSING:ERROR_FILES' },
					{ name: 'Postprocessing OK Files', value: 'GatherResults:POSTPROCESSING:OK_FILES' },
					{ name: 'Postprocessing Results', value: 'GatherResults:POSTPROCESSING' },
				],
				default: 'GatherResults:MAIN:OK_FILES',
				description: 'Required OneVision gather-results filter for job files',
			},
			// Job: Overview filter
			{
				displayName: 'Overview Filter',
				name: 'jobOverviewFilter',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['getOverview'],
					},
				},
				default: '',
				description: 'Optional comma-separated list of overview fields to return',
			},
			// Job: Resume module type
			{
				displayName: 'Module Type',
				name: 'resumeModuleType',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['resumeActions'],
					},
				},
				default: '*',
				description: 'Internal module type whose scheduled actions should be resumed. Use * for all module types.',
			},
			// Job: Resume module name
			{
				displayName: 'Module Name',
				name: 'resumeModuleName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['resumeActions'],
					},
				},
				default: '',
				description: 'Optional module name to restrict resumed scheduled actions',
			},
			// Job: Include parent jobs
			{
				displayName: 'Include Parent Jobs',
				name: 'includeParentJobs',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['resumeActions'],
					},
				},
				default: false,
				description: 'Whether the resume request should also apply to parent jobs',
			},
			// Job: Include child jobs
			{
				displayName: 'Include Child Jobs',
				name: 'includeChildJobs',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['resumeActions'],
					},
				},
				default: false,
				description: 'Whether the resume request should also apply to child jobs',
			},
			// Job: Resume Actions Body
			{
				displayName: 'Legacy Resume Actions JSON',
				name: 'resumeActionsBody',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['resumeActions'],
					},
				},
				default: '{}',
				description: 'Legacy extra query parameters as JSON. The current API uses the typed query fields above.',
			},
			// Job: Update Body
			{
				displayName: 'Update Data',
				name: 'updateData',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['update'],
					},
				},
				default: '{}',
				description: 'JSON object with job fields to update (e.g., {"priority": 80, "comment": "updated"})',
			},
			// Job: Get All - Optional filter
			{
				displayName: 'Filter',
				name: 'jobFilter',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['job'],
						operation: ['getAll'],
					},
				},
				default: '',
				description: 'Optional filter string to limit job results (e.g., assembly line name or status)',
			},

			// ============================================
			// JOB START OPERATIONS
			// ============================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['jobStart'],
					},
				},
				options: [
					{
						name: 'Start HTTP Job',
						value: 'startHttp',
						description: 'Start a job with HTTP payload',
						action: 'Start HTTP job',
					},
					{
						name: 'Start PACE Job',
						value: 'startPace',
						description: 'Start a job from PACE ticket',
						action: 'Start PACE job',
					},
					{
						name: 'Start Ticket Job',
						value: 'startTicket',
						description: 'Start a job from JDF ticket',
						action: 'Start ticket job',
					},
				],
				default: 'startHttp',
			},
			// Job Start: Job Name
			{
				displayName: 'Job Name',
				name: 'jobName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['jobStart'],
						operation: ['startHttp'],
					},
				},
				default: '',
				description: 'Name for the new job',
			},
			// Job Start: File Name
			{
				displayName: 'File Name',
				name: 'fileName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['jobStart'],
						operation: ['startHttp'],
					},
				},
				default: '',
				description: 'File name for the job',
			},
			// Job Start: Assembly Line
			{
				displayName: 'Assembly Line',
				name: 'assemblyLine',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['jobStart'],
						operation: ['startHttp', 'startPace'],
					},
				},
				default: '',
				description: 'Assembly line to start the job on. Required for HTTP and PACE ticket starts.',
			},
			// Job Start: Priority
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['jobStart'],
						operation: ['startHttp'],
					},
				},
				default: 50,
				description: 'Job priority (0-100)',
			},
			// Job Start: Job Data (HTTP)
			{
				displayName: 'Job Data',
				name: 'jobData',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						resource: ['jobStart'],
						operation: ['startHttp'],
					},
				},
				default: '{}',
				description: 'JSON data payload for the job',
			},
			// Job Start: Ticket XML (for startTicket and startPace)
			{
				displayName: 'Ticket XML',
				name: 'ticketXml',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['jobStart'],
						operation: ['startTicket', 'startPace'],
					},
				},
				default: '',
				description: 'JDF or PACE ticket XML content',
			},

			// ============================================
			// MODULE OPERATIONS
			// ============================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['module'],
					},
				},
				options: [
					{
						name: 'Get Info',
						value: 'getInfo',
						description: 'Get information about a specific module instance',
						action: 'Get module info',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many module instances',
						action: 'Get many modules',
					},
					{
						name: 'Resume Continue on REST',
						value: 'resumeContinueOnRest',
						description: 'Resume a Continue on REST module',
						action: 'Resume continue on REST module',
					},
				],
				default: 'getAll',
			},
			// Module: Machine Identifier (for getInfo)
			{
				displayName: 'Machine Identifier',
				name: 'machineIdentifier',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['module'],
						operation: ['getInfo', 'resumeContinueOnRest'],
					},
				},
				default: '',
			},
			// Module: Module Name (for getInfo)
			{
				displayName: 'Module Name',
				name: 'moduleName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['module'],
						operation: ['getInfo'],
					},
				},
				default: '',
				description: 'Name of the module instance to retrieve information for',
			},
			// Module: Job Identifier (for resumeContinueOnRest)
			{
				displayName: 'Job Identifier',
				name: 'jobIdentifier',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['module'],
						operation: ['resumeContinueOnRest'],
					},
				},
				default: '',
				description: 'Job identifier to resume',
			},
			// Module: Signal Identifier (optional for resumeContinueOnRest)
			{
				displayName: 'Signal Identifier',
				name: 'signalIdentifier',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['module'],
						operation: ['resumeContinueOnRest'],
					},
				},
				default: '',
				description: 'Optional signal identifier',
			},

			// ============================================
			// STATISTICS OPERATIONS
			// ============================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['statistics'],
					},
				},
				options: [
					{
						name: 'Get Current Assembly Lines',
						value: 'getCurrentAssemblyLines',
						description: 'Get current assembly line statistics',
						action: 'Get current assembly line statistics',
					},
					{
						name: 'Get Current Jobs',
						value: 'getCurrentJobs',
						description: 'Get current job statistics',
						action: 'Get current job statistics',
					},
					{
						name: 'Get Current Machines',
						value: 'getCurrentMachines',
						description: 'Get current machine statistics',
						action: 'Get current machine statistics',
					},
					{
						name: 'Get Current Modules',
						value: 'getCurrentModules',
						description: 'Get current module statistics',
						action: 'Get current module statistics',
					},
					{
						name: 'Get History Assembly Lines',
						value: 'getHistoryAssemblyLines',
						description: 'Get assembly line history',
						action: 'Get assembly line history',
					},
					{
						name: 'Get History Machines',
						value: 'getHistoryMachines',
						description: 'Get machine history',
						action: 'Get machine history',
					},
					{
						name: 'Get History Metadata',
						value: 'getHistoryMetadata',
						action: 'Get history metadata',
					},
					{
						name: 'Get History Modules',
						value: 'getHistoryModules',
						description: 'Get module history',
						action: 'Get module history',
					},
					{
						name: 'Get History Running Jobs',
						value: 'getHistoryRunningJobs',
						description: 'Get running jobs history',
						action: 'Get running jobs history',
					},
					{
						name: 'Get History Started/Finished Jobs',
						value: 'getHistoryStartedFinished',
						description: 'Get started/finished jobs history',
						action: 'Get started finished jobs history',
					},
				],
				default: 'getCurrentJobs',
			},
			// Statistics: Current workload filter
			{
				displayName: 'Filter',
				name: 'currentFilter',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['statistics'],
						operation: [
							'getCurrentAssemblyLines',
							'getCurrentMachines',
							'getCurrentModules',
						],
					},
				},
				default: '',
				description: 'Optional filter for current workload statistics',
			},
			// Statistics: Timeline (for history operations)
			{
				displayName: 'Timeline',
				name: 'timeLine',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						resource: ['statistics'],
						operation: [
							'getHistoryAssemblyLines',
							'getHistoryMachines',
							'getHistoryModules',
							'getHistoryRunningJobs',
							'getHistoryStartedFinished',
						],
					},
				},
				options: [
					{
						name: 'Day',
						value: 'DAY',
						description: 'Daily timeline',
					},
					{
						name: 'Month',
						value: 'MONTH',
						description: 'Monthly timeline',
					},
					{
						name: 'Week',
						value: 'WEEK',
						description: 'Weekly timeline',
					},
					{
						name: 'Year',
						value: 'YEAR',
						description: 'Yearly timeline',
					},
				],
				default: 'DAY',
				description: 'Timeline period for historical data',
			},
			// Statistics: Filter (for history operations)
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['statistics'],
						operation: [
							'getHistoryAssemblyLines',
							'getHistoryMachines',
							'getHistoryModules',
						],
					},
				},
				default: '',
				description: 'Optional filter string to limit results (e.g., assembly line name, module name)',
			},

			// ============================================
			// STORAGE OPERATIONS
			// ============================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['storage'],
					},
				},
				options: [
					{
						name: 'Create Folder',
						value: 'createFolder',
						description: 'Create a new folder in storage',
						action: 'Create folder',
					},
					{
						name: 'Delete File',
						value: 'deleteFile',
						description: 'Delete a file from storage',
						action: 'Delete file',
					},
					{
						name: 'Get File',
						value: 'getFile',
						description: 'Get a file from storage',
						action: 'Get file',
					},
					{
						name: 'Get Folder',
						value: 'getFolder',
						description: 'Get folder contents',
						action: 'Get folder',
					},
					{
						name: 'Get Metadata',
						value: 'getMetadata',
						description: 'Get file or folder metadata',
						action: 'Get metadata',
					},
					{
						name: 'Upload File',
						value: 'uploadFile',
						description: 'Upload a file to storage',
						action: 'Upload file',
					},
				],
				default: 'getFile',
			},
			// Storage: Resource Path
			{
				displayName: 'Resource Path',
				name: 'resourcePath',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['storage'],
					},
				},
				default: '',
				description: 'Path to the file or folder under resources',
				placeholder: 'folder/subfolder/file.pdf',
			},
			// Storage: File Content (for upload)
			{
				displayName: 'File Content',
				name: 'fileContent',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['storage'],
						operation: ['uploadFile'],
					},
				},
				default: '',
				description: 'Content to upload (binary data as string or use binary data from previous node)',
			},
			{
				displayName: 'Last Modified',
				name: 'lastModified',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['storage'],
						operation: ['uploadFile', 'deleteFile'],
					},
				},
				default: '',
				description: 'Optional timestamp guard from resource metadata for upload/delete integrity checks',
			},

			// ============================================
			// SUBSTRATE OPERATIONS
			// ============================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['substrate'],
					},
				},
				options: [
					{
						name: 'Get Last Changed',
						value: 'getLastChanged',
						description: 'Get the substrate last changed marker from /substrate/lastChanged',
						action: 'Get substrate last changed marker',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many substrates from /substrate/all',
						action: 'Get many substrates',
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Data Keys',
				name: 'dataKeys',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['substrate'],
						operation: ['getAll'],
					},
				},
				default: '',
				description: 'Optional comma-separated substrate data keys to return. Leave empty for all data keys.',
			},

			// ============================================
			// SYSTEM OPERATIONS
			// ============================================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['system'],
					},
				},
				options: [
					{
						name: 'Get Build Number',
						value: 'getBuildNumber',
						description: 'Get system build number',
						action: 'Get build number',
					},
					{
						name: 'Get Job Start Enabled',
						value: 'getJobStartEnabled',
						description: 'Check if job start is enabled',
						action: 'Get job start enabled status',
					},
					{
						name: 'Get System Problems',
						value: 'getSystemProblems',
						description: 'Get current system problems',
						action: 'Get system problems',
					},
					{
						name: 'Get Version',
						value: 'getVersion',
						description: 'Get system version',
						action: 'Get version',
					},
					{
						name: 'Set Job Start Enabled',
						value: 'setJobStartEnabled',
						description: 'Enable or disable job start',
						action: 'Set job start enabled',
					},
				],
				default: 'getVersion',
			},
			// System: Enabled Status (for setJobStartEnabled)
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				required: true,
				displayOptions: {
					show: {
						resource: ['system'],
						operation: ['setJobStartEnabled'],
					},
				},
				default: true,
				description: 'Whether to enable or disable job start',
			},
			{
				displayName: 'Locale',
				name: 'locale',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['system'],
						operation: ['getSystemProblems'],
					},
				},
				default: '',
				description: 'Optional locale for localized system problem messages, such as en or en_US',
			},
		],
		usableAsTool: true,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('oneVisionApi');
		const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				const requestOptions: {
					headers: Record<string, string>;
					url: string;
					method: IHttpRequestMethods;
					qs?: IDataObject;
					body?: GenericValue | GenericValue[] | IDataObject | IDataObject[];
					returnFullResponse?: boolean;
				} = {
					headers: {
						'Accept': 'application/json',
					},
					url: '',
					method: 'GET' as IHttpRequestMethods,
					returnFullResponse: false,
				};

				// ============================================
				// API REQUEST RESOURCE
				// ============================================
				if (resource === 'apiRequest' && operation === 'make') {
					const method = this.getNodeParameter('apiRequestMethod', i) as IHttpRequestMethods;
					const rawPath = this.getNodeParameter('apiRequestPath', i) as string;
					const queryJson = this.getNodeParameter('apiRequestQuery', i, '{}') as string;
					const bodyJson = this.getNodeParameter('apiRequestBody', i, '{}') as string;
					const query = typeof queryJson === 'string' ? JSON.parse(queryJson) : queryJson;
					const body = typeof bodyJson === 'string' ? JSON.parse(bodyJson) : bodyJson;
					const normalizedPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
					const restPath = normalizedPath.startsWith('/rest/') ? normalizedPath.replace(/^\/rest/, '') : normalizedPath;

					requestOptions.url = `${baseUrl}/ws/rest${restPath}`;
					requestOptions.method = method;
					requestOptions.qs = query as IDataObject;
					if (Object.keys(body as IDataObject).length > 0) {
						requestOptions.headers['Content-Type'] = 'application/json';
						requestOptions.body = body;
					}
				}

				// ============================================
				// ASSEMBLY LINE RESOURCE
				// ============================================
				else if (resource === 'assemblyLine') {
					if (operation === 'getAll') {
						const status = this.getNodeParameter('assemblyLineStatus', i, '') as string;
						const moduleType = this.getNodeParameter('moduleType', i, '') as string;
						const startMarkType = this.getNodeParameter('startMarkType', i, '') as string;
						const maxResults = this.getNodeParameter('maxResults', i, 0) as number;
						const qs: IDataObject = {};
						requestOptions.url = `${baseUrl}/ws/rest/assemblyline`;
						if (status) qs.status = status;
						if (moduleType) qs.moduleType = moduleType;
						if (startMarkType) qs.startMarkType = startMarkType;
						if (maxResults > 0) qs.maxResults = maxResults;
						if (Object.keys(qs).length > 0) {
							requestOptions.qs = qs;
						}
					} else if (operation === 'activate' || operation === 'activateGet') {
						const assemblyLine = this.getNodeParameter('assemblyLine', i) as string;
						requestOptions.url = `${baseUrl}/ws/rest/assemblyline/activate`;
						requestOptions.method = operation === 'activateGet' ? 'GET' : 'PUT';
						requestOptions.qs = { name: assemblyLine };
					} else if (operation === 'deactivate' || operation === 'deactivateGet') {
						const assemblyLine = this.getNodeParameter('assemblyLine', i) as string;
						requestOptions.url = `${baseUrl}/ws/rest/assemblyline/deactivate`;
						requestOptions.method = operation === 'deactivateGet' ? 'GET' : 'PUT';
						requestOptions.qs = { name: assemblyLine };
					} else if (operation === 'getXml') {
						const assemblyLineId = this.getNodeParameter('assemblyLineId', i) as string;
						requestOptions.url = `${baseUrl}/ws/rest/assemblyline/${assemblyLineId}/xml`;
						requestOptions.headers['Accept'] = 'application/xml';
					}
				}

				// ============================================
				// AUTHENTICATION RESOURCE
				// ============================================
				else if (resource === 'authentication') {
					if (operation === 'alive') {
						const userId = this.getNodeParameter('userId', i) as string;
						requestOptions.url = `${baseUrl}/ws/rest/authentication/alive`;
						requestOptions.qs = { userID: userId };
					} else if (operation === 'login') {
						const username = this.getNodeParameter('username', i) as string;
						const password = this.getNodeParameter('password', i) as string;
						const crypt = this.getNodeParameter('crypt', i, '') as string;
						const cryptParam = this.getNodeParameter('cryptParam', i, '') as string;
						const mandatoryUserRights = this.getNodeParameter('mandatoryUserRights', i, '') as string;
						const optionalUserRights = this.getNodeParameter('optionalUserRights', i, '') as string;
						const applicationName = this.getNodeParameter('applicationName', i, '') as string;
						const qs: IDataObject = { username, password };
						requestOptions.url = `${baseUrl}/ws/rest/authentication/login`;
						if (crypt) qs.crypt = crypt;
						if (cryptParam) qs.cryptParam = cryptParam;
						if (mandatoryUserRights) qs.mandatoryUserRights = mandatoryUserRights;
						if (optionalUserRights) qs.optionalUserRights = optionalUserRights;
						if (applicationName) qs.applicationName = applicationName;
						requestOptions.qs = qs;
					} else if (operation === 'logout') {
						const userId = this.getNodeParameter('userId', i) as string;
						requestOptions.url = `${baseUrl}/ws/rest/authentication/logout`;
						requestOptions.qs = { userID: userId };
					}
				}

				// ============================================
				// JMF RESOURCE
				// ============================================
				else if (resource === 'jmf') {
					const jmfXml = this.getNodeParameter('jmfXml', i) as string;
					requestOptions.headers['Content-Type'] = 'application/xml';
					requestOptions.headers['Accept'] = 'application/xml';
					requestOptions.body = jmfXml;
					if (operation === 'sendToAssemblyLine' || operation === 'sendToAssemblyLinePut') {
						const assemblyLine = this.getNodeParameter('assemblyLine', i) as string;
						requestOptions.url = `${baseUrl}/ws/rest/jmf/al`;
						requestOptions.method = operation === 'sendToAssemblyLinePut' ? 'PUT' : 'POST';
						requestOptions.qs = { assemblyline: assemblyLine };
					} else if (operation === 'sendToMachine' || operation === 'sendToMachinePut') {
						const deviceName = this.getNodeParameter('deviceName', i) as string;
						const machineName = this.getNodeParameter('machineName', i) as string;
						requestOptions.url = `${baseUrl}/ws/rest/jmf/device/${deviceName}/${machineName}`;
						requestOptions.method = operation === 'sendToMachinePut' ? 'PUT' : 'POST';
					}
				}

				// ============================================
				// JOB RESOURCE
				// ============================================
				else if (resource === 'job') {
					if (operation === 'getAll') {
						requestOptions.url = `${baseUrl}/ws/rest/job`;
						const jobFilter = this.getNodeParameter('jobFilter', i) as string;
						if (jobFilter) {
							requestOptions.qs = { filter: jobFilter };
						}
					} else {
						const jobId = this.getNodeParameter('jobId', i) as string;
						if (operation === 'getOverview') {
							const filter = this.getNodeParameter('jobOverviewFilter', i, '') as string;
							requestOptions.url = `${baseUrl}/ws/rest/job/${jobId}/overview`;
							if (filter) {
								requestOptions.qs = { filter };
							}
						} else if (operation === 'getFiles') {
							const filter = this.getNodeParameter('jobFileFilter', i, 'GatherResults:MAIN:OK_FILES') as string;
							requestOptions.url = `${baseUrl}/ws/rest/job/${jobId}/files`;
							requestOptions.qs = { filter };
						} else if (operation === 'getLog') {
							requestOptions.url = `${baseUrl}/ws/rest/job/${jobId}/log`;
						} else if (operation === 'delete') {
							requestOptions.url = `${baseUrl}/ws/rest/job/${jobId}`;
							requestOptions.method = 'DELETE';
						} else if (operation === 'update') {
							const updateData = this.getNodeParameter('updateData', i) as string;
							requestOptions.url = `${baseUrl}/ws/rest/job/${jobId}`;
							requestOptions.method = 'PUT';
							requestOptions.headers['Content-Type'] = 'application/json';
							requestOptions.body = JSON.parse(updateData as string);
						} else if (operation === 'resumeActions') {
							const moduleType = this.getNodeParameter('resumeModuleType', i, '*') as string;
							const moduleName = this.getNodeParameter('resumeModuleName', i, '') as string;
							const includeParentJobs = this.getNodeParameter('includeParentJobs', i, false) as boolean;
							const includeChildJobs = this.getNodeParameter('includeChildJobs', i, false) as boolean;
							const resumeActionsBody = this.getNodeParameter('resumeActionsBody', i, '{}') as string;
							const extraQuery = typeof resumeActionsBody === 'string' ? JSON.parse(resumeActionsBody) : resumeActionsBody;
							const qs: IDataObject = { moduleType, ...extraQuery };
							requestOptions.url = `${baseUrl}/ws/rest/job/${jobId}/resumeActions`;
							requestOptions.method = 'PUT';
							if (moduleName) qs.moduleName = moduleName;
							if (includeParentJobs) qs.includeParentJobs = includeParentJobs;
							if (includeChildJobs) qs.includeChildJobs = includeChildJobs;
							requestOptions.qs = qs;
						}
					}
				}

				// ============================================
				// JOB START RESOURCE
				// ============================================
				else if (resource === 'jobStart') {
					if (operation === 'startHttp') {
						const assemblyLine = this.getNodeParameter('assemblyLine', i) as string;
						const jobName = this.getNodeParameter('jobName', i) as string;
						const fileName = this.getNodeParameter('fileName', i) as string;
						const priority = this.getNodeParameter('priority', i) as number;
						const jobData = this.getNodeParameter('jobData', i) as string;
						requestOptions.url = `${baseUrl}/ws/rest/jobstart/http`;
						requestOptions.method = 'POST';
						requestOptions.headers['Content-Type'] = 'application/json';
						requestOptions.qs = {
							jobName,
							fileName,
							priority: priority.toString(),
							assemblyline: assemblyLine,
						};
						requestOptions.body = JSON.parse(jobData as string);
					} else if (operation === 'startTicket') {
						const ticketXml = this.getNodeParameter('ticketXml', i) as string;
						requestOptions.url = `${baseUrl}/ws/rest/jobstart/ticket`;
						requestOptions.method = 'POST';
						requestOptions.headers['Content-Type'] = 'application/xml';
						requestOptions.headers['Accept'] = 'application/xml';
						requestOptions.body = ticketXml;
					} else if (operation === 'startPace') {
						const assemblyLine = this.getNodeParameter('assemblyLine', i) as string;
						const ticketXml = this.getNodeParameter('ticketXml', i) as string;
						requestOptions.url = `${baseUrl}/ws/rest/jobstart/ticket/pace`;
						requestOptions.method = 'POST';
						requestOptions.headers['Content-Type'] = 'application/xml';
						requestOptions.headers['Accept'] = 'application/xml';
						requestOptions.qs = { assemblyline: assemblyLine };
						requestOptions.body = ticketXml;
					}
				}

				// ============================================
				// MODULE RESOURCE
				// ============================================
				else if (resource === 'module') {
					if (operation === 'getAll') {
						requestOptions.url = `${baseUrl}/ws/rest/modules`;
					} else if (operation === 'getInfo') {
						const machineIdentifier = this.getNodeParameter('machineIdentifier', i) as string;
						const moduleName = this.getNodeParameter('moduleName', i) as string;
						requestOptions.url = `${baseUrl}/ws/rest/modules/${machineIdentifier}/${moduleName}`;
					} else if (operation === 'resumeContinueOnRest') {
						const jobIdentifier = this.getNodeParameter('jobIdentifier', i) as string;
						const machineIdentifier = this.getNodeParameter('machineIdentifier', i) as string;
						const signalIdentifier = this.getNodeParameter('signalIdentifier', i) as string;
						requestOptions.url = `${baseUrl}/ws/rest/modules/continueonrest/resume`;
						requestOptions.method = 'PUT';
						requestOptions.qs = {
							jobIdentifier,
							machineIdentifier,
						};
						if (signalIdentifier) {
							requestOptions.qs.signalIdentifier = signalIdentifier;
						}
					}
				}

				// ============================================
				// STATISTICS RESOURCE
				// ============================================
				else if (resource === 'statistics') {
					if (operation === 'getCurrentAssemblyLines') {
						const filter = this.getNodeParameter('currentFilter', i, '') as string;
						requestOptions.url = `${baseUrl}/ws/rest/statistics/current/assemblylines`;
						if (filter) {
							requestOptions.qs = { filter };
						}
					} else if (operation === 'getCurrentJobs') {
						requestOptions.url = `${baseUrl}/ws/rest/statistics/current/jobs`;
					} else if (operation === 'getCurrentMachines') {
						const filter = this.getNodeParameter('currentFilter', i, '') as string;
						requestOptions.url = `${baseUrl}/ws/rest/statistics/current/machines`;
						if (filter) {
							requestOptions.qs = { filter };
						}
					} else if (operation === 'getCurrentModules') {
						const filter = this.getNodeParameter('currentFilter', i, '') as string;
						requestOptions.url = `${baseUrl}/ws/rest/statistics/current/modules`;
						if (filter) {
							requestOptions.qs = { filter };
						}
					} else if (operation === 'getHistoryAssemblyLines') {
						const timeLine = this.getNodeParameter('timeLine', i) as string;
						const filter = this.getNodeParameter('filter', i) as string;
						requestOptions.url = `${baseUrl}/ws/rest/statistics/history/assemblylines/${timeLine}`;
						if (filter) {
							requestOptions.qs = { filter };
						}
					} else if (operation === 'getHistoryMachines') {
						const timeLine = this.getNodeParameter('timeLine', i) as string;
						const filter = this.getNodeParameter('filter', i) as string;
						requestOptions.url = `${baseUrl}/ws/rest/statistics/history/machines/${timeLine}`;
						if (filter) {
							requestOptions.qs = { filter };
						}
					} else if (operation === 'getHistoryMetadata') {
						requestOptions.url = `${baseUrl}/ws/rest/statistics/history/metaData`;
					} else if (operation === 'getHistoryModules') {
						const timeLine = this.getNodeParameter('timeLine', i) as string;
						const filter = this.getNodeParameter('filter', i) as string;
						requestOptions.url = `${baseUrl}/ws/rest/statistics/history/modules/${timeLine}`;
						if (filter) {
							requestOptions.qs = { filter };
						}
					} else if (operation === 'getHistoryRunningJobs') {
						const timeLine = this.getNodeParameter('timeLine', i) as string;
						const filter = this.getNodeParameter('filter', i, '') as string;
						requestOptions.url = `${baseUrl}/ws/rest/statistics/history/runningJobs/${timeLine}`;
						if (filter) {
							requestOptions.qs = { filter };
						}
					} else if (operation === 'getHistoryStartedFinished') {
						const timeLine = this.getNodeParameter('timeLine', i) as string;
						const filter = this.getNodeParameter('filter', i, '') as string;
						requestOptions.url = `${baseUrl}/ws/rest/statistics/history/startedFinishedJobs/${timeLine}`;
						if (filter) {
							requestOptions.qs = { filter };
						}
					}
				}

				// ============================================
				// STORAGE RESOURCE
				// ============================================
				else if (resource === 'storage') {
					const resourcePath = this.getNodeParameter('resourcePath', i) as string;
					if (operation === 'getFile') {
						requestOptions.url = `${baseUrl}/ws/rest/storage/file/resources/${resourcePath}`;
					} else if (operation === 'uploadFile') {
						const fileContent = this.getNodeParameter('fileContent', i) as string;
						const lastModified = this.getNodeParameter('lastModified', i, '') as string;
						requestOptions.url = `${baseUrl}/ws/rest/storage/file/resources/${resourcePath}`;
						requestOptions.method = 'PUT';
						requestOptions.body = fileContent;
						if (lastModified) {
							requestOptions.qs = { lastModified };
						}
					} else if (operation === 'deleteFile') {
						const lastModified = this.getNodeParameter('lastModified', i, '') as string;
						requestOptions.url = `${baseUrl}/ws/rest/storage/file/resources/${resourcePath}`;
						requestOptions.method = 'DELETE';
						if (lastModified) {
							requestOptions.qs = { lastModified };
						}
					} else if (operation === 'getFolder') {
						requestOptions.url = `${baseUrl}/ws/rest/storage/folder/resources/${resourcePath}`;
					} else if (operation === 'createFolder') {
						requestOptions.url = `${baseUrl}/ws/rest/storage/folder/resources/${resourcePath}`;
						requestOptions.method = 'POST';
					} else if (operation === 'getMetadata') {
						requestOptions.url = `${baseUrl}/ws/rest/storage/metadata/resources/${resourcePath}`;
					}
				}

				// ============================================
				// SUBSTRATE RESOURCE
				// ============================================
				else if (resource === 'substrate') {
					if (operation === 'getAll') {
						const dataKeys = this.getNodeParameter('dataKeys', i, '') as string;
						requestOptions.url = `${baseUrl}/ws/rest/substrate/all`;
						if (dataKeys) {
							requestOptions.qs = {
								dataKeys: dataKeys.split(',').map((dataKey) => dataKey.trim()).filter(Boolean),
							};
						}
					} else if (operation === 'getLastChanged') {
						requestOptions.url = `${baseUrl}/ws/rest/substrate/lastChanged`;
					}
				}

				// ============================================
				// SYSTEM RESOURCE
				// ============================================
				else if (resource === 'system') {
					if (operation === 'getVersion') {
						requestOptions.url = `${baseUrl}/ws/rest/system/version`;
					} else if (operation === 'getBuildNumber') {
						requestOptions.url = `${baseUrl}/ws/rest/system/buildnumber`;
					} else if (operation === 'getJobStartEnabled') {
						requestOptions.url = `${baseUrl}/ws/rest/system/jobStartEnabled`;
					} else if (operation === 'setJobStartEnabled') {
						const enabled = this.getNodeParameter('enabled', i) as boolean;
						requestOptions.url = `${baseUrl}/ws/rest/system/jobStartEnabled`;
						requestOptions.method = 'PUT';
						requestOptions.qs = { enable: enabled ? 'TRUE' : 'FALSE' };
					} else if (operation === 'getSystemProblems') {
						const locale = this.getNodeParameter('locale', i, '') as string;
						requestOptions.url = `${baseUrl}/ws/rest/system/systemProblems`;
						if (locale) {
							requestOptions.qs = { locale };
						}
					}
				}

				// Execute the request
				const responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'oneVisionApi', requestOptions);

				// Handle response
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), (error as Error).message, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
