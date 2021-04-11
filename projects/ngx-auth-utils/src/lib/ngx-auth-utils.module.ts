import {ModuleWithProviders, NgModule, Provider} from '@angular/core';
import {AuthenticationProvider, FakeAuthenticationProvider,} from './providers/authentication.provider';
import {AUTHENTICATION_HEADER, HOME_URL, LOGIN_URL, TOKEN_TYPE,} from './config';
import {AuthenticationService} from './services/authentication.service';
import {MemoryStorageProvider, StorageProvider,} from './providers/storage.provider';
import {AuthInterceptor} from "./interceptors/auth.interceptor";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AuthExpiredInterceptor} from "./interceptors/auth-expired.interceptor";

export interface NgxAuthUtilsConfig {
  authenticationProvider: Provider;
  storageProvider?: Provider;
  loginUrl?: string;
  homeUrl?: string;
  authenticationHeader?: string;
  tokenType?: 'Token' | 'Bearer';
}

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: AuthExpiredInterceptor,
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: AuthInterceptor,
    }
  ]
})
export class NgxAuthUtilsModule {
  static forRoot(
    config: NgxAuthUtilsConfig
  ): ModuleWithProviders<NgxAuthUtilsModule> {
    return {
      ngModule: NgxAuthUtilsModule,
      providers: [
        config.authenticationProvider ?? {
          provider: AuthenticationProvider,
          useClass: FakeAuthenticationProvider,
        },
        config.storageProvider ?? {
          provide: StorageProvider,
          useClass: MemoryStorageProvider,
        },
        { provide: LOGIN_URL, useValue: config?.loginUrl ?? '/auth/login' },
        { provide: HOME_URL, useValue: config?.homeUrl ?? '/' },
        {
          provide: AUTHENTICATION_HEADER,
          useValue: config?.authenticationHeader ?? 'Authorization',
        },
        { provide: TOKEN_TYPE, useValue: config?.tokenType ?? 'Bearer' },
        AuthenticationService,
      ],
    };
  }
}