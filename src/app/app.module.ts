import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { AppRoutingModule } from './app-routing.module';

import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { httpInterceptorProviders } from 'config/http-interceptor';

import { AppComponent } from './app.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './pages/login/login.component';

registerLocaleData(zh);

const declarations = [AppComponent, NotFoundComponent, LoginComponent];

const imports = [
  BrowserModule,
  AppRoutingModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  BrowserAnimationsModule,
  NgZorroAntdModule
];

const providers = [{ provide: NZ_I18N, useValue: zh_CN }, httpInterceptorProviders];

@NgModule({
  declarations: [...declarations],
  imports: [...imports],
  providers: [...providers],
  bootstrap: [AppComponent]
})
export class AppModule {}
