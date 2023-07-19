/** @param { import("node-pg-migrate").MigrationBuilder } pgm */

const INDEX_METHOD = process.env.PG_IDENT_INDEX_TYPE;

exports.up = pgm => {
  pgm.createTable('stx_events', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    event_index: {
      type: 'integer',
      notNull: true,
    },
    tx_id: {
      notNull: true,
      type: 'bytea',
    },
    tx_index: {
      type: 'smallint',
      notNull: true,
    },
    block_height: {
      type: 'integer',
      notNull: true,
    },
    index_block_hash: {
      type: 'bytea',
      notNull: true,
    },
    parent_index_block_hash: {
      type: 'bytea',
      notNull: true,
    },
    microblock_hash: {
      type: 'bytea',
      notNull: true,
    },
    microblock_sequence: {
      type: 'integer',
      notNull: true,
    },
    microblock_canonical: {
      type: 'boolean',
      notNull: true,
    },
    canonical: {
      type: 'boolean',
      notNull: true,
    },
    asset_event_type_id: {
      type: 'smallint',
      notNull: true,
    },
    amount: {
      type: 'bigint',
      notNull: true,
    },
    sender: 'string',
    recipient: 'string',
    memo: 'bytea',
  });

  pgm.createIndex('stx_events', 'tx_id', { method: INDEX_METHOD });
  pgm.createIndex('stx_events', 'index_block_hash', { method: INDEX_METHOD });
  pgm.createIndex('stx_events', 'microblock_hash', { method: INDEX_METHOD });
  pgm.createIndex('stx_events', 'sender', { method: INDEX_METHOD });
  pgm.createIndex('stx_events', 'recipient', { method: INDEX_METHOD });
  pgm.createIndex('stx_events', 'event_index');
  pgm.createIndex('stx_events', [{ name: 'block_height', sort: 'DESC' }]);

  pgm.addConstraint('stx_events', 'valid_asset_transfer', `CHECK (asset_event_type_id != 1 OR (
    NOT (sender, recipient) IS NULL
  ))`);

  pgm.addConstraint('stx_events', 'valid_asset_mint', `CHECK (asset_event_type_id != 2 OR (
    sender IS NULL AND recipient IS NOT NULL
  ))`);

  pgm.addConstraint('stx_events', 'valid_asset_burn', `CHECK (asset_event_type_id != 3 OR (
    recipient IS NULL AND sender IS NOT NULL
  ))`);
}
