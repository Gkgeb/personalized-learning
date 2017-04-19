define(['../guard'], function (guard) {
    "use strict";

    function ActivityDefinition(spec) {
        guard.throwIfSpecIsUndefined(spec, 'ActivityDefinition');

        guard.throwIfNotLanguageMap(spec.name, 'You should provide name for ActivityDefinition');

        if (typeof spec.name != typeof undefined) {
            this.name = spec.name;
        }

        if (typeof spec.type != typeof undefined) {
            this.type = spec.type;
        }

        if (typeof spec.interactionType != typeof undefined) {
            this.interactionType = spec.interactionType;
        }

        if (typeof spec.correctResponsesPattern != typeof undefined) {
            this.correctResponsesPattern = spec.correctResponsesPattern;
        }

        if (typeof spec.choices != typeof undefined) {
            this.choices = spec.choices;
        }
		
		if (typeof spec.source != typeof undefined) {
            this.source = spec.source;
        }
		
		if (typeof spec.target != typeof undefined) {
            this.target = spec.target;
        }
    }

    return ActivityDefinition;
});