import type { ProviderCode } from '@/shared/settings';
import { validateProviderConfig } from './validateProviderConfig';
import { createEmptyProviderResponseError } from './providerErrors';
import type {
  ProviderResponseResult,
  ProviderTranslateInput,
  ProviderTranslateResult,
  TranslationProvider,
  TranslationProviderRuntimeConfig,
} from './types';

export abstract class BaseTranslationProvider<
  TRequestBody,
  TProviderResponse,
> implements TranslationProvider {
  protected abstract readonly provider: ProviderCode;
  protected abstract readonly config: TranslationProviderRuntimeConfig;

  async translate(
    input: ProviderTranslateInput,
  ): Promise<ProviderTranslateResult> {
    const configError = validateProviderConfig({
      provider: this.provider,
      ...this.config,
    });

    if (configError) {
      return configError;
    }

    const body = this.createRequestBody(input);
    const response = await this.fetchProviderResponse(body);

    if (!response.ok) {
      return response;
    }

    const translatedText = this.extractTranslatedText(
      response.parsedProviderResponse,
    ).trim();

    if (!translatedText) {
      return createEmptyProviderResponseError({
        provider: this.provider,
        modelId: this.config.modelId,
      });
    }

    return {
      ok: true,
      translatedText,
      provider: this.provider,
      modelId: this.config.modelId,
      rawProviderResponse: response.rawProviderResponse,
    };
  }

  protected abstract createRequestBody(
    input: ProviderTranslateInput,
  ): TRequestBody;

  protected abstract fetchProviderResponse(
    body: TRequestBody,
  ): Promise<ProviderResponseResult<TProviderResponse>>;

  protected abstract extractTranslatedText(response: TProviderResponse): string;
}
