/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { onUnexpectedExternalError } from '../../../base/common/errors';
import { TPromise } from '../../../base/common/winjs.base';
import { registerDefaultLanguageCommand } from '../../browser/editorExtensions';
import { DefinitionProviderRegistry, ImplementationProviderRegistry, TypeDefinitionProviderRegistry } from '../../common/modes';
import { asWinJsPromise } from '../../../base/common/async';
import { flatten } from '../../../base/common/arrays';
function getDefinitions(model, position, registry, provide) {
    var provider = registry.ordered(model);
    // get results
    var promises = provider.map(function (provider) {
        return asWinJsPromise(function (token) {
            return provide(provider, model, position, token);
        }).then(undefined, function (err) {
            onUnexpectedExternalError(err);
            return null;
        });
    });
    return TPromise.join(promises)
        .then(flatten)
        .then(function (references) { return references.filter(function (x) { return !!x; }); });
}
export function getDefinitionsAtPosition(model, position) {
    return getDefinitions(model, position, DefinitionProviderRegistry, function (provider, model, position, token) {
        return provider.provideDefinition(model, position, token);
    });
}
export function getImplementationsAtPosition(model, position) {
    return getDefinitions(model, position, ImplementationProviderRegistry, function (provider, model, position, token) {
        return provider.provideImplementation(model, position, token);
    });
}
export function getTypeDefinitionsAtPosition(model, position) {
    return getDefinitions(model, position, TypeDefinitionProviderRegistry, function (provider, model, position, token) {
        return provider.provideTypeDefinition(model, position, token);
    });
}
registerDefaultLanguageCommand('_executeDefinitionProvider', getDefinitionsAtPosition);
registerDefaultLanguageCommand('_executeImplementationProvider', getImplementationsAtPosition);
registerDefaultLanguageCommand('_executeTypeDefinitionProvider', getTypeDefinitionsAtPosition);
