import { Model, ModelAttributeColumnOptions, Sequelize } from 'sequelize';

// ! В Sequelize@7 можно будет обойтись без этого класса
export class CustomModel<
  TModelAttributes extends object = object,
  TCreationAttributes extends object = TModelAttributes,
> extends Model<TModelAttributes, TCreationAttributes> {
  static attributes: Record<string, ModelAttributeColumnOptions>;

  public static connect(sequelize: Sequelize): void {
    this.init(this.attributes, { sequelize, modelName: this.name });
  }
}
