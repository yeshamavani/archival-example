import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import {
  ArchivalComponent,
  ArchivalComponentBindings,
} from '@sourceloop/archival';

import {
  ExportArchiveDataProvider,
  ImportArchiveDataProvider,
} from '@sourceloop/archival/aws-s3';

import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  CoreComponent,
  SECURITY_SCHEME_SPEC,
  ServiceSequence,
} from '@sourceloop/core';
import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';
import {AuthenticationComponent} from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';
import path from 'path';
import {ProcessImportedDataProvider} from './providers/process-import-data.provider';
import {BuildWhereConditionService} from './services/build-where-condition.service';

export {ApplicationConfig};

export class SampleAppApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    const port = 3000;
    dotenv.config();
    dotenvExt.load({
      schema: '.env.example',
      errorOnMissing: process.env.NODE_ENV !== 'test',
      includeProcessEnv: true,
    });
    options.rest = options.rest ?? {};
    options.rest.basePath = process.env.BASE_PATH ?? '';
    options.rest.port = +(process.env.PORT ?? port);
    options.rest.host = process.env.HOST;
    options.rest.openApiSpec = {
      endpointMapping: {
        [`${options.rest.basePath}/openapi.json`]: {
          version: '3.0.0',
          format: 'json',
        },
      },
    };

    super(options);

    // Set up the custom sequence
    this.component(AuthenticationComponent);
    this.component(CoreComponent);

    // all from base component -- start

    this.sequence(ServiceSequence);
    this.component(AuthenticationComponent);

    // Mount authorization component for default sequence
    this.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.component(AuthorizationComponent);
    this.component(ArchivalComponent);
    this.bind(ArchivalComponentBindings.EXPORT_ARCHIVE_DATA).toProvider(
      ExportArchiveDataProvider,
    );
    this.bind(ArchivalComponentBindings.IMPORT_ARCHIVE_DATA).toProvider(
      ImportArchiveDataProvider,
    );
    this.bind(ArchivalComponentBindings.PROCESS_IMPORT_DATA).toProvider(
      ProcessImportedDataProvider,
    );
    this.bind('services.BuildWhereConditionService').toClass(
      BuildWhereConditionService,
    );
    // Mount bearer verifier component
    this.bind(BearerVerifierBindings.Config).to({
      type: BearerVerifierType.service,
      useSymmetricEncryption: true,
    } as BearerVerifierConfig);
    this.component(BearerVerifierComponent);
    // Add authorization component
    this.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer', '/openapi.json'],
    });
    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
    this.api({
      openapi: '3.0.0',
      info: {
        title: 'Archive Application',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
      servers: [{url: '/'}],
    });
  }
}
