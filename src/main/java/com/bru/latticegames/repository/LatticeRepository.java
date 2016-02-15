package com.bru.latticegames.repository;

import com.bru.latticegames.domain.Lattice;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Lattice entity.
 */
public interface LatticeRepository extends JpaRepository<Lattice,Long> {

}
