// import {inject} from '@loopback/core';
// import {DefaultCrudRepository, juggler} from '@loopback/repository';

// import {ArchivalDbSourceName} from '@sourceloop/archival';
// import {ArchiveMapping} from '../models';

// export class ArchivalMappingRepository extends DefaultCrudRepository<
//   ArchiveMapping,
//   typeof ArchiveMapping.prototype.id
// > {
//   constructor(
//     @inject(`datasources.${ArchivalDbSourceName}`)
//     dataSource: juggler.DataSource,
//   ) {
//     super(ArchiveMapping, dataSource);
//   }
// }
