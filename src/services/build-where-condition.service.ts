import {BindingScope, injectable} from '@loopback/core';
import {AnyObject, Filter} from '@loopback/repository';
import {
  ArchiveMapping,
  IBuildWhereConditionService,
} from '@sourceloop/archival';

@injectable({scope: BindingScope.TRANSIENT})
export class BuildWhereConditionService implements IBuildWhereConditionService {
  constructor() {}
  async buildConditionForFetch(
    filter: AnyObject,
    modelName: string,
  ): Promise<Filter<ArchiveMapping>> {
    console.log('in my serviceeeee');
    const archiveFilter: Filter<ArchiveMapping> = {};
    archiveFilter.where = {actedOn: modelName};
    return archiveFilter;
  }

  async buildConditionForInsert(
    where: AnyObject | undefined,
  ): Promise<AnyObject> {
    console.log('in my serviceeeee');

    return where ?? {};
  }
}
