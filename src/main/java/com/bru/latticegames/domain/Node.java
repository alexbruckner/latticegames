package com.bru.latticegames.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * A Node.
 */
@Entity
@Table(name = "node")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class    Node implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "x")
    private Integer x;

    @Column(name = "y")
    private Integer y;

    @ManyToOne
    @JoinColumn(name = "lattice_id")
    private Lattice lattice;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "node_neighbour",
               joinColumns = @JoinColumn(name="nodes_id", referencedColumnName="ID"),
               inverseJoinColumns = @JoinColumn(name="neighbours_id", referencedColumnName="ID"))
    private Set<Node> neighbours = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getX() {
        return x;
    }

    public void setX(Integer x) {
        this.x = x;
    }

    public Integer getY() {
        return y;
    }

    public void setY(Integer y) {
        this.y = y;
    }

    public Lattice getLattice() {
        return lattice;
    }

    public void setLattice(Lattice lattice) {
        this.lattice = lattice;
    }

    public Set<Node> getNeighbours() {
        return neighbours;
    }

    public void setNeighbours(Set<Node> nodes) {
        this.neighbours = nodes;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Node node = (Node) o;
        if(node.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, node.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Node{" +
            "id=" + id +
            ", name='" + name + "'" +
            ", x='" + x + "'" +
            ", y='" + y + "'" +
            '}';
    }
}
