import {Getter, inject} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {
  AbstractConstructor,
  ArchivalRepositoryMixin,
  ArchiveOptions,
} from '@sourceloop/archival';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {DbDataSource} from '../datasources';
import {Product, ProductRelations} from '../models';

// export class ProductRepository extends DefaultUserModifyCrudRepository<
//   Product,
//   typeof Product.prototype.id,
//   ProductRelations
// > {
//   constructor(
//     @inject('datasources.db') dataSource: DbDataSource,
//     @inject.getter(AuthenticationBindings.CURRENT_USER)
//     protected readonly getCurrentUser: Getter<
//       IAuthUserWithPermissions | undefined
//     >,
//   ) {
//     super(Product, dataSource, getCurrentUser);
//   }
// }

export class ProductRepository extends ArchivalRepositoryMixin<
  Product,
  typeof Product.prototype.id,
  ProductRelations,
  AbstractConstructor<
    DefaultUserModifyCrudRepository<
      Product,
      typeof Product.prototype.id,
      ProductRelations
    >
  >
>(DefaultUserModifyCrudRepository, {}) {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public readonly getCurrentUser: Getter<IAuthUserWithPermissions>,
    @repository.getter('ProductRepository')
    public getRepository: Getter<ProductRepository>,
  ) {
    super(Product, dataSource, getCurrentUser);
  }
  async archive(filter: Filter<Product>, options?: ArchiveOptions) {
    await super.archive(filter, options);
  }
}
