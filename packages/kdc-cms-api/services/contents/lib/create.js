import { DDB } from 'kdc-cms-dynamodb';
import { successPOST, failure } from '../../../lib/response';
import defGet from '../../define/contents/lib/get';
import get from './get';
import inc from '../../define/contents/lib/inc';

export default async ({ Slug, id, ...attr }) => {
  const current = await get({ slug: Slug, id }, { raw: true });
  if (current) {
    if (current.statusCode) return current;
    return failure(409, {
      error: 'ContentExists',
      message: 'Content already exists',
      Slug
    });
  }

  const definition = await defGet({ id }, { raw: true });
  if (!definition) {
    return failure(400, {
      error: 'ContentDefinitionNotFound',
      message: 'Content definition not found',
      id
    });
  }

  const validAttr = {};
  definition.fields.forEach(f => {
    if (attr[f.name]) {
      validAttr[f.name] = attr[f.name];
    }
  });
  if (attr.createdAt) {
    validAttr.createdAt = attr.createdAt;
  }
  if (attr.updatedAt) {
    validAttr.updatedAt = attr.updatedAt;
  }

  const sortKey = validAttr[definition.sortKey];
  if (!sortKey) {
    return failure(400, {
      error: 'SortKeyInvalid',
      message: 'Sort key cannot be blank'
    });
  }

  const createdAt = new Date().valueOf();
  const Item = {
    pk: Slug,
    sk: `content#${id}`,
    gs1pk: `content#${id}`,
    gs1sk: sortKey,
    sortKeyUsed: definition.sortKey,
    createdAt,
    ...validAttr
  };

  const params = { Item };

  try {
    await DDB('put', params);
    // increment count in definition
    await inc({ id, inc: 1 });

    return successPOST({ id: Item.pk });
  } catch (e) {
    return failure(500, e);
  }
};
