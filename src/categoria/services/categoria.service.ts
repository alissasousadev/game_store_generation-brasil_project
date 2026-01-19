import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from '../entities/categoria.entity';
import { Like } from 'typeorm';

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
        tipo: Like(`%${tipo}%`),
      },
      relations: {
        produto: true,
      },
    });
  }

  async create(categoria: Categoria): Promise<Categoria> {
    const categoriaExistente = await this.categoriaRepository.findOne({
    where: { tipo: categoria.tipo },
  });

  if (categoriaExistente)
    throw new BadRequestException('Categoria já existe');

    return this.categoriaRepository.save(categoria);
  }

  async update(categoria: Categoria): Promise<Categoria> {
    await this.findById(categoria.id);

    const categoriaExistente = await this.categoriaRepository.findOne({
    where: { tipo: categoria.tipo },
  });

  if (categoriaExistente && categoriaExistente.id !== categoria.id)
    throw new BadRequestException('Categoria já existe');
  
    return this.categoriaRepository.save(categoria);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    await this.categoriaRepository.delete(id);
  }

  
}
