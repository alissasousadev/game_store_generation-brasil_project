import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from '../entities/categoria.entity';

@Injectable()
export class CategoriaService {

  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) {}

  async findAll(): Promise<Categoria[]> {
    return this.categoriaRepository.find({
      relations: {
        produto: true,
      },
    });
  }

  async findById(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
      relations: {
        produto: true,
      },
    });

    if (!categoria)
      throw new NotFoundException('Categoria não encontrada');

    return categoria;
  }

  async findByTipo(tipo: string): Promise<Categoria[]> {
    return this.categoriaRepository.find({
      where: {
        tipo: tipo,
      },
    });
  }

  async create(categoria: Categoria): Promise<Categoria> {
    return this.categoriaRepository.save(categoria);
  }

  async update(categoria: Categoria): Promise<Categoria> {
    await this.findById(categoria.id);
    return this.categoriaRepository.save(categoria);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    await this.categoriaRepository.delete(id);
  }
}
