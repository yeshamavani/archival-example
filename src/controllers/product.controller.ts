import {Application, CoreBindings, inject, service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Where,
  repository,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {
  ArchivalComponentBindings,
  GetJobDetailsFn,
  ImportArchivedDataService,
  JobResponse,
} from '@sourceloop/archival';
import {
  CONTENT_TYPE,
  OPERATION_SECURITY_SPEC,
  STATUS_CODE,
} from '@sourceloop/core';
import {STRATEGY, authenticate} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {Product} from '../models';
import {ProductRepository} from '../repositories';

export class ProductController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
    @inject(ArchivalComponentBindings.GET_ARCHIVED_DATA_JOB)
    private readonly getJobDetails: GetJobDetailsFn,
    @service(ImportArchivedDataService)
    public importArchivedDataService: ImportArchivedDataService,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: ['*'],
  })
  @post('/products')
  @response(200, {
    description: 'Product model instance',
    content: {'application/json': {schema: getModelSchemaRef(Product)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProduct',
            exclude: ['id'],
          }),
        },
      },
    })
    product: Omit<Product, 'id'>,
  ): Promise<Product> {
    return this.productRepository.create(product);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: ['*'],
  })
  @get('/products/count')
  @response(200, {
    description: 'Product model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Product) where?: Where<Product>): Promise<Count> {
    return this.productRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: ['*'],
  })
  @get('/products')
  @response(200, {
    description: 'Array of Product model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Product, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Product) filter?: Filter<Product>,
  ): Promise<Product[]> {
    return this.productRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: ['*'],
  })
  @patch('/products')
  @response(200, {
    description: 'Product PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
    product: Product,
    @param.where(Product) where?: Where<Product>,
  ): Promise<Count> {
    return this.productRepository.updateAll(product, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: ['*'],
  })
  @get('/products/{id}')
  @response(200, {
    description: 'Product model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Product, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Product, {exclude: 'where'})
    filter?: FilterExcludingWhere<Product>,
  ): Promise<Product> {
    return this.productRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: ['*'],
  })
  @patch('/products/{id}')
  @response(204, {
    description: 'Product PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
    product: Product,
  ): Promise<void> {
    await this.productRepository.updateById(id, product);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: ['*'],
  })
  @put('/products/{id}')
  @response(204, {
    description: 'Product PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() product: Product,
  ): Promise<void> {
    await this.productRepository.replaceById(id, product);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: ['*'],
  })
  @del('/products/{id}')
  @response(204, {
    description: 'Product DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.productRepository.deleteById(id);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: ['*'],
  })
  @del('/products/archive', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'ApprovalRequest DELETE success',
      },
    },
  })
  async archive(): Promise<void> {
    const where: Where<Product> = {
      description: 'sunsilk',
    };
    await this.productRepository.deleteAll(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @get('/products/archive', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Product model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Product)}},
      },
    },
  })
  async getArchivedData(
    @param.filter(Product) filter?: Filter<Product>,
  ): Promise<JobResponse> {
    //return this.productRepository.find(filter);
    const jobDetails = await this.getJobDetails('Product', filter);
    this.importArchivedDataService.import(jobDetails.jobId);
    return jobDetails;
  }
}
