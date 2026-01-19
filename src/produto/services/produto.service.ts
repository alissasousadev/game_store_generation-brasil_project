import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Produto } from '../entities/produto.entity'; 

@Injectable()
export class ProdutoService {

  constructor(
    @InjectRepository(Produto)
    private produtoRepository: Repository<Produto>,
  ) {}

  async findAll(): Promise<Produto[]> {
    return this.produtoRepository.find({
      relations: {
        categoria: true,
      },
    });
  }

  async findById(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({
      where: { id },
      relations: {
        categoria: true,
      },
    });

    if (!produto)
      throw new NotFoundException('Produto não encontrado');

    return produto;
  }

  async findByNome(nome: string): Promise<Produto[]> {
    return this.produtoRepository.find({
      where: {
        nome: Like(`%${nome}%`),
      },
      relations: {
        categoria: true,
      },
    });
  }

  async create(produto: Produto): Promise<Produto> {
    const produtoExistente = await this.produtoRepository.findOne({
      where: { nome: produto.nome },
    });

    if (produtoExistente)
      throw new BadRequestException('Produto já existe');
    return this.produtoRepository.save(produto);
  }

  async update(produto: Produto): Promise<Produto> {
    await this.findById(produto.id);

    const produtoExistente = await this.produtoRepository.findOne({
      where: { nome: produto.nome },
    });

    if (produtoExistente && produtoExistente.id !== produto.id)
      throw new BadRequestException('Produto já existe');

    return this.produtoRepository.save(produto);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id);
    await this.produtoRepository.delete(id);
  }
}
