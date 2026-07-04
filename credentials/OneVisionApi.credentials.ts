import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class OneVisionApi implements ICredentialType {
	name = 'oneVisionApi';
	displayName = 'OneVision API';
	icon: Icon = 'file:OneVision.svg';
	documentationUrl = 'https://ov.visualgraphx.com/ws/pages/swagger/';
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your OneVision Workspace Server API Key (X-API-Key header)',
			placeholder: 'wsAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://ov.visualgraphx.com',
			required: true,
			description: 'The base URL for your OneVision Workspace Server instance',
			placeholder: 'https://your-onevision-server.com',
		},
	];
	test: ICredentialTestRequest = {
		request: {
			url: '={{$credentials.baseUrl.replace(/\\/$/, "") + "/ws/rest/system/version"}}',
		},
	};
}
