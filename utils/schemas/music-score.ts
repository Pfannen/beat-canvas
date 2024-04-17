import { Schema } from 'ajv';

const schema: Schema = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	definitions: {
		Note: {
			properties: {
				annotations: {
					properties: {
						accent: {
							enum: ['strong', 'weak'],
							type: 'string',
						},
						accidental: {
							enum: ['flat', 'natural', 'sharp'],
							type: 'string',
						},
						chord: {
							const: true,
							type: 'boolean',
						},
						dotted: {
							const: true,
							type: 'boolean',
						},
						dynamic: {
							enum: ['f', 'ff', 'fp', 'mf', 'mp', 'p', 'pp'],
							type: 'string',
						},
						slur: {
							properties: {
								start: {
									type: 'number',
								},
								stop: {
									items: {
										type: 'number',
									},
									type: 'array',
								},
							},
							type: 'object',
						},
						staccato: {
							type: 'boolean',
						},
					},
					type: 'object',
				},
				type: {
					$ref: '#/definitions/NoteType',
				},
				x: {
					type: 'number',
				},
				y: {
					type: 'number',
				},
			},
			required: ['type', 'x', 'y'],
			type: 'object',
		},
		NoteType: {
			enum: [
				'dotted-eighth',
				'dotted-half',
				'dotted-quarter',
				'dotted-sixteenth',
				'dotted-thirtysecond',
				'eighth',
				'half',
				'quarter',
				'sixteenth',
				'thirtysecond',
				'whole',
			],
			type: 'string',
		},
		'Partial<DynamicMeasureAttributes>': {
			properties: {
				dynamic: {
					enum: ['f', 'ff', 'fp', 'mf', 'mp', 'p', 'pp'],
					type: 'string',
				},
				metronome: {
					properties: {
						beatNote: {
							type: 'number',
						},
						beatsPerMinute: {
							type: 'number',
						},
					},
					required: ['beatNote', 'beatsPerMinute'],
					type: 'object',
				},
				wedge: {
					properties: {
						crescendo: {
							type: 'boolean',
						},
						measureEnd: {
							type: 'number',
						},
						xEnd: {
							type: 'number',
						},
					},
					required: ['crescendo', 'measureEnd', 'xEnd'],
					type: 'object',
				},
			},
			type: 'object',
		},
		'Partial<StaticMeasureAttributes>': {
			properties: {
				clef: {
					enum: ['alto', 'baritone', 'bass', 'soprano', 'tenor', 'treble'],
					type: 'string',
				},
				keySignature: {
					type: 'number',
				},
				repeat: {
					anyOf: [
						{
							properties: {
								forward: {
									const: true,
									type: 'boolean',
								},
							},
							required: ['forward'],
							type: 'object',
						},
						{
							properties: {
								forward: {
									const: false,
									type: 'boolean',
								},
								jumpMeasure: {
									type: 'number',
								},
								remainingRepeats: {
									type: 'number',
								},
								repeatCount: {
									type: 'number',
								},
							},
							required: [
								'forward',
								'jumpMeasure',
								'remainingRepeats',
								'repeatCount',
							],
							type: 'object',
						},
					],
				},
				repeatEndings: {
					additionalProperties: false,
					patternProperties: {
						'^[0-9]+$': {
							type: 'number',
						},
					},
					type: 'object',
				},
				timeSignature: {
					properties: {
						beatNote: {
							type: 'number',
						},
						beatsPerMeasure: {
							type: 'number',
						},
					},
					required: ['beatNote', 'beatsPerMeasure'],
					type: 'object',
				},
			},
			type: 'object',
		},
	},
	properties: {
		parts: {
			items: {
				properties: {
					attributes: {
						properties: {
							id: {
								type: 'string',
							},
							instrument: {
								type: 'string',
							},
							name: {
								type: 'string',
							},
						},
						required: ['id', 'instrument', 'name'],
						type: 'object',
					},
					measures: {
						items: {
							properties: {
								notes: {
									items: {
										$ref: '#/definitions/Note',
									},
									type: 'array',
								},
								staticAttributes: {
									$ref: '#/definitions/Partial<StaticMeasureAttributes>',
								},
								temporalAttributes: {
									items: {
										properties: {
											attributes: {
												$ref: '#/definitions/Partial<DynamicMeasureAttributes>',
											},
											x: {
												type: 'number',
											},
										},
										required: ['attributes', 'x'],
										type: 'object',
									},
									type: 'array',
								},
							},
							required: ['notes'],
							type: 'object',
						},
						type: 'array',
					},
				},
				required: ['attributes', 'measures'],
				type: 'object',
			},
			type: 'array',
		},
		title: {
			type: 'string',
		},
	},
	required: ['parts', 'title'],
	type: 'object',
};

export default schema;
