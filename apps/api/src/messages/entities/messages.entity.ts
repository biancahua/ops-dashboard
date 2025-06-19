import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: true })
  phone?: number;

  @Column({ type: 'varchar', nullable: true })
  sender_type?: string;

  @Column({ type: 'uuid', default: null, nullable: true })
  operator_id?: string;

  @Column({ type: 'varchar', nullable: true })
  content?: string;

  @Column({ type: 'varchar', nullable: true })
  status?: string;

  @Column('simple-json', { nullable: true, default: '[]' })
  actions?: Action[];

  @Column({ nullable: true })
  outcome?: string;

  @Column({ type: 'varchar', nullable: true })
  reason?: string;

  @Column({ type: 'varchar', nullable: true })
  job_type?: string;

  @Column({ type: 'int', nullable: true })
  urgency?: number;
}

export interface Action {
  type?: string;
  result?: string;
  error?: string | null;
}
