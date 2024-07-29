import {Getter, inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  AbstractConstructor,
  ArchivalRepositoryMixin,
} from '@sourceloop/archival';
import {
  DefaultUserModifyCrudRepository,
  IAuthUserWithPermissions,
} from '@sourceloop/core';
import {AuthenticationBindings} from 'loopback4-authentication';
import {DbDataSource} from '../datasources';
import {Product} from '../models';
export class ProductRepository extends ArchivalRepositoryMixin<
  Product,
  typeof Product.prototype.id,
  {},
  AbstractConstructor<
    DefaultUserModifyCrudRepository<Product, typeof Product.prototype.id, {}>
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
}
